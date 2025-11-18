/**
 * WebSocket Server
 *
 * Real-time collaboration server using Socket.io
 * Handles:
 * - User presence tracking
 * - Live cursor positions
 * - Document synchronization
 * - Dream room management
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Initialize Redis for multi-instance scaling
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

// In-memory storage (use Redis in production)
const dreamRooms = new Map(); // dreamId => Set of userIds
const userPresence = new Map(); // userId => { socketId, dreamId, cursor }
const onlineUsers = new Set();

/**
 * Authenticate WebSocket connection
 */
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const userId = socket.handshake.auth.userId;

  if (!token || !userId) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    if (decoded.userId !== userId) {
      return next(new Error('Invalid token'));
    }

    socket.userId = userId;
    socket.username = decoded.username || decoded.email;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

/**
 * Connection handler
 */
io.on('connection', (socket) => {
  const { userId, username } = socket;

  console.log(`[WebSocket] User connected: ${userId} (${socket.id})`);

  // Add to online users
  onlineUsers.add(userId);

  // Broadcast user online status
  socket.broadcast.emit('user:online', { userId, username });

  /**
   * Join dream room
   */
  socket.on('dream:join', ({ dreamId }) => {
    console.log(`[WebSocket] ${userId} joining dream ${dreamId}`);

    // Leave previous room if any
    const currentDream = userPresence.get(userId)?.dreamId;
    if (currentDream && currentDream !== dreamId) {
      socket.leave(`dream:${currentDream}`);
      removeUserFromDream(currentDream, userId);
    }

    // Join new room
    socket.join(`dream:${dreamId}`);

    // Track room membership
    if (!dreamRooms.has(dreamId)) {
      dreamRooms.set(dreamId, new Set());
    }
    dreamRooms.get(dreamId).add(userId);

    // Update user presence
    userPresence.set(userId, {
      socketId: socket.id,
      dreamId,
      cursor: null,
      joinedAt: Date.now()
    });

    // Notify others in room
    const usersInRoom = Array.from(dreamRooms.get(dreamId)).map(uid => ({
      userId: uid,
      username: getUserName(uid),
      cursor: userPresence.get(uid)?.cursor
    }));

    // Send current participants to joiner
    socket.emit('dream:participants', { dreamId, users: usersInRoom });

    // Notify others of new participant
    socket.to(`dream:${dreamId}`).emit('user:joined', {
      userId,
      username,
      dreamId
    });

    // Publish to Redis for multi-instance support
    if (redis) {
      redis.publish('dream:join', JSON.stringify({ dreamId, userId, username }));
    }
  });

  /**
   * Leave dream room
   */
  socket.on('dream:leave', ({ dreamId }) => {
    console.log(`[WebSocket] ${userId} leaving dream ${dreamId}`);

    socket.leave(`dream:${dreamId}`);
    removeUserFromDream(dreamId, userId);

    socket.to(`dream:${dreamId}`).emit('user:left', {
      userId,
      dreamId
    });

    userPresence.delete(userId);
  });

  /**
   * Update cursor position
   */
  socket.on('cursor:update', ({ dreamId, position }) => {
    const presence = userPresence.get(userId);
    if (presence) {
      presence.cursor = position;
      userPresence.set(userId, presence);
    }

    // Broadcast to others in room
    socket.to(`dream:${dreamId}`).emit('cursor:move', {
      userId,
      username,
      position
    });
  });

  /**
   * Document change (Operational Transform)
   */
  socket.on('document:change', ({ dreamId, change }) => {
    console.log(`[WebSocket] Document change in ${dreamId} by ${userId}`);

    // Broadcast change to others in room (excluding sender)
    socket.to(`dream:${dreamId}`).emit('document:change', {
      userId,
      username,
      change,
      timestamp: Date.now()
    });

    // Persist change to database (async)
    persistChange(dreamId, userId, change).catch(err => {
      console.error('[WebSocket] Failed to persist change:', err);
    });

    // Publish to Redis
    if (redis) {
      redis.publish('document:change', JSON.stringify({
        dreamId,
        userId,
        change,
        timestamp: Date.now()
      }));
    }
  });

  /**
   * Fragment added
   */
  socket.on('fragment:added', ({ dreamId, fragment }) => {
    socket.to(`dream:${dreamId}`).emit('fragment:added', {
      userId,
      fragment,
      timestamp: Date.now()
    });
  });

  /**
   * Todo updated
   */
  socket.on('todo:updated', ({ dreamId, todo }) => {
    socket.to(`dream:${dreamId}`).emit('todo:updated', {
      userId,
      todo,
      timestamp: Date.now()
    });
  });

  /**
   * Typing indicator
   */
  socket.on('typing:start', ({ dreamId }) => {
    socket.to(`dream:${dreamId}`).emit('user:typing', {
      userId,
      username
    });
  });

  socket.on('typing:stop', ({ dreamId }) => {
    socket.to(`dream:${dreamId}`).emit('user:stopped-typing', {
      userId
    });
  });

  /**
   * Disconnect handler
   */
  socket.on('disconnect', () => {
    console.log(`[WebSocket] User disconnected: ${userId} (${socket.id})`);

    // Remove from online users
    onlineUsers.delete(userId);

    // Get user's dream room
    const presence = userPresence.get(userId);
    if (presence && presence.dreamId) {
      const { dreamId } = presence;

      // Remove from room
      removeUserFromDream(dreamId, userId);

      // Notify others
      socket.to(`dream:${dreamId}`).emit('user:left', {
        userId,
        dreamId
      });
    }

    // Clean up presence
    userPresence.delete(userId);

    // Broadcast user offline
    socket.broadcast.emit('user:offline', { userId });
  });
});

/**
 * Helper: Remove user from dream room
 */
function removeUserFromDream(dreamId, userId) {
  const room = dreamRooms.get(dreamId);
  if (room) {
    room.delete(userId);
    if (room.size === 0) {
      dreamRooms.delete(dreamId);
    }
  }
}

/**
 * Helper: Get username for user ID
 */
function getUserName(userId) {
  // In production, fetch from database
  const presence = userPresence.get(userId);
  return presence?.username || 'Anonymous';
}

/**
 * Helper: Persist document change to database
 */
async function persistChange(dreamId, userId, change) {
  // In production, save to database
  // Example: await db.documentChanges.create({ dreamId, userId, change, timestamp: Date.now() })
  console.log(`[DB] Persisting change for dream ${dreamId}`);
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    onlineUsers: onlineUsers.size,
    activeRooms: dreamRooms.size,
    timestamp: new Date().toISOString()
  });
});

/**
 * Stats endpoint
 */
app.get('/stats', (req, res) => {
  const stats = {
    connections: io.engine.clientsCount,
    onlineUsers: onlineUsers.size,
    activeRooms: dreamRooms.size,
    rooms: Array.from(dreamRooms.entries()).map(([dreamId, users]) => ({
      dreamId,
      userCount: users.size
    }))
  };

  res.json(stats);
});

// Start server
const PORT = process.env.WEBSOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log(`[WebSocket] Server listening on port ${PORT}`);
  console.log(`[WebSocket] Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);

  if (redis) {
    console.log('[WebSocket] Redis connected for multi-instance support');
  } else {
    console.log('[WebSocket] Running in single-instance mode (no Redis)');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[WebSocket] SIGTERM received, closing server...');

  server.close(() => {
    console.log('[WebSocket] Server closed');
    if (redis) {
      redis.quit();
    }
    process.exit(0);
  });
});

module.exports = { io, server };

# Quick Start: Deploy to Production in 30 Minutes

This guide will get Dreamcatcher running in production as quickly as possible. For a comprehensive checklist, see [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md).

## Prerequisites

- A server (Ubuntu 22.04 LTS recommended, 4 CPU / 8GB RAM minimum)
- A domain name
- Supabase account (free tier works for testing)
- Stripe account
- OpenAI API key

## Step 1: Server Setup (5 minutes)

SSH into your server and run the automated setup:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/yourusername/dreamcatcher/main/scripts/setup-production.sh -o setup.sh
chmod +x setup.sh
sudo ./setup.sh
```

This installs:
- Docker & Docker Compose
- Firewall configuration
- SSL certificate tools
- Monitoring tools

## Step 2: Clone Repository (2 minutes)

```bash
cd /opt/dreamcatcher
git clone https://github.com/yourusername/dreamcatcher.git .
```

## Step 3: Configure Environment (10 minutes)

Create your production environment file:

```bash
cp .env.example .env.production
nano .env.production
```

**Required variables** (replace with your actual values):

```bash
# Application
NODE_ENV=production
CLIENT_URL=https://yourdomain.com

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Redis (use Redis Cloud free tier or self-host)
REDIS_URL=redis://default:[password]@redis-server:6379

# Security
JWT_SECRET=$(openssl rand -base64 64)  # Generate secure random key

# AI
OPENAI_API_KEY=sk-your-key-here

# Payments
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-key

# Monitoring (optional but recommended)
SENTRY_DSN=your-sentry-dsn
```

## Step 4: Set Up Database (3 minutes)

Run migrations:

```bash
npm run migrate
```

Or manually:

```bash
docker-compose run --rm api node server/database/migrate.js
```

## Step 5: Deploy Backend (5 minutes)

```bash
# Build and start services
./scripts/deploy.sh production

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

Verify services are healthy:
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
```

## Step 6: Deploy Frontend (5 minutes)

### Option A: Vercel (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `VITE_API_URL=https://api.yourdomain.com`
   - `VITE_WEBSOCKET_URL=https://ws.yourdomain.com`
   - `VITE_SUPABASE_URL=your-supabase-url`
   - `VITE_SUPABASE_ANON_KEY=your-anon-key`
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx`
4. Deploy!

### Option B: Self-Hosted

```bash
# Build frontend
npm run build

# Serve with Nginx (already configured in docker-compose.yml)
# Frontend will be available at https://yourdomain.com
```

## Step 7: Configure Nginx & SSL (5 minutes)

Update nginx configuration with your domain:

```bash
nano nginx/nginx.conf
# Replace "yourdomain.com" with your actual domain
```

Get SSL certificates:

```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com -d ws.yourdomain.com
```

Restart nginx:

```bash
docker-compose restart nginx
```

## Step 8: Verify Everything Works

Test these endpoints:

```bash
# Frontend
https://yourdomain.com ✓

# API
https://api.yourdomain.com/health ✓

# WebSocket
https://ws.yourdomain.com/health ✓
```

Test key features:
1. Sign up for new account
2. Create a dream
3. Test AI assistant
4. Test real-time collaboration
5. Test payment (use Stripe test mode first)

## Quick Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs api
docker-compose logs websocket

# Restart services
docker-compose restart
```

### Database connection issues

```bash
# Test database connection
docker-compose exec api node -e "
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log('Connected:', !!supabase);
"
```

### Can't connect to Redis

```bash
# Test Redis connection
docker-compose exec api node -e "
  const redis = require('redis');
  const client = redis.createClient({ url: process.env.REDIS_URL });
  client.connect().then(() => console.log('Redis connected'));
"
```

## Next Steps

### Monitoring Setup

Add Sentry for error tracking:

```bash
# Already configured! Just add SENTRY_DSN to .env.production
```

### Set Up Backups

```bash
# Database backups (runs daily at 2 AM)
crontab -e
```

Add:
```
0 2 * * * cd /opt/dreamcatcher && docker-compose exec -T postgres pg_dump -U dreamcatcher dreamcatcher > /opt/backups/db-$(date +\%Y\%m\%d).sql
```

### Configure Alerts

Set up uptime monitoring at [UptimeRobot](https://uptimerobot.com) (free):

- Monitor: https://yourdomain.com/health
- Monitor: https://api.yourdomain.com/health
- Monitor: https://ws.yourdomain.com/health

Alert channels: Email, Slack, SMS

### Enable Auto-Deploy (Optional)

GitHub Actions is already configured! Just add these secrets:

1. Go to GitHub repository settings
2. Add secrets:
   - `PRODUCTION_HOST`: Your server IP
   - `PRODUCTION_USER`: SSH username
   - `PRODUCTION_SSH_KEY`: SSH private key
   - `SLACK_WEBHOOK`: For deployment notifications

Now every push to `main` automatically deploys!

## Cost Breakdown (Monthly)

**Starting Out (<100 users):**
- DigitalOcean Droplet (4GB): $24
- Supabase (Free): $0
- Redis Cloud (Free): $0
- Vercel (Free): $0
- **Total: ~$24/month**

**Growing (100-1000 users):**
- DigitalOcean Droplet (8GB): $48
- Supabase Pro: $25
- Redis Cloud (1GB): $15
- Vercel Pro: $20
- **Total: ~$108/month**

## Support

- 📖 Full docs: [DEPLOYMENT.md](./DEPLOYMENT.md)
- ✅ Checklist: [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord/Slack

---

**You're live! 🎉** Now monitor your logs for the first few hours and enjoy your production deployment!

```bash
# Keep this running in a terminal
docker-compose logs -f
```

# Dreamcatcher Microservices Architecture

**Version:** 2.0.0  
**Date:** December 2024  
**Status:** Implementation Planning  
**Purpose:** Define microservices architecture for Dreamcatcher integration with PipelineOS

---

## 🎯 **Architecture Overview**

Dreamcatcher is transitioning from a standalone application to a **baked-in microservice** within the PipelineOS ecosystem, while maintaining standalone capabilities for freemium users.

---

## 🏗️ **Target Architecture**

### **PipelineOS Integration**
```
pipelineos/
├── services/
│   ├── orchestrator/       # Main orchestrator service
│   ├── connex/            # Connex microservice (baked-in)
│   ├── ipde/              # IPDE microservice (baked-in)
│   ├── builder-assistant/ # Builder Assistant microservice (baked-in)
│   ├── dreamcatcher/      # Dreamcatcher microservice (baked-in)
│   └── common/            # Shared utilities
├── apps/
│   ├── hub/               # Next.js frontend
│   ├── connex/            # Connex standalone app
│   ├── ipde/              # IPDE standalone app
│   └── dreamcatcher/      # Dreamcatcher standalone app
└── extensions/
    ├── dreamcatcher/      # Chrome extension
    ├── ipde/              # IPDE extension
    └── vscode/             # VS Code extension
```

### **Dreamcatcher Standalone**
```
dreamcatcher/
├── apps/
│   ├── web/               # React web application
│   └── extension/         # Chrome extension
├── packages/
│   ├── shared/            # Shared utilities
│   ├── types/             # TypeScript types
│   └── ui/                # Shared UI components
└── docs/                  # Documentation
```

---

## 🔧 **Implementation Files**

### **1. Dreamcatcher Microservice**

#### **Main Service**
```python
# services/dreamcatcher/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Dream, Fragment, Implementation
from .services import DreamService, FragmentService, ConversationService

app = FastAPI(title="Dreamcatcher Service", version="2.0.0")

@app.post("/api/v1/dreams/import")
async def import_dream(
    dream_data: dict,
    db: Session = Depends(get_db)
):
    """Import dream from extension"""
    dream_service = DreamService(db)
    result = await dream_service.import_dream(dream_data)
    return result

@app.post("/api/v1/conversations/capture")
async def capture_conversation(
    conversation_data: dict,
    db: Session = Depends(get_db)
):
    """Capture AI conversation"""
    conversation_service = ConversationService(db)
    result = await conversation_service.capture_conversation(conversation_data)
    return result

@app.get("/api/v1/dreams/{dream_id}/implement")
async def implement_dream(
    dream_id: str,
    db: Session = Depends(get_db)
):
    """Implement dream as project"""
    dream_service = DreamService(db)
    result = await dream_service.implement_dream(dream_id)
    return result

@app.websocket("/ws/dreamcatcher/{dream_id}")
async def websocket_endpoint(websocket: WebSocket, dream_id: str):
    """WebSocket endpoint for real-time dream updates"""
    await websocket.accept()
    # Handle real-time dream updates
    while True:
        data = await websocket.receive_text()
        # Process and broadcast dream updates
        await websocket.send_text(data)
```

#### **Database Models**
```python
# services/dreamcatcher/app/models.py
from sqlalchemy import Column, String, DateTime, JSON, Text, Boolean, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Dream(Base):
    __tablename__ = "dreams"
    
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="idea")
    tags = Column(JSON)
    created = Column(DateTime, default=func.now())
    updated = Column(DateTime, default=func.now(), onupdate=func.now())
    synced_with_pipelineos = Column(Boolean, default=False)
    synced_at = Column(DateTime)
    pipelineos_project_id = Column(String)

class Fragment(Base):
    __tablename__ = "fragments"
    
    id = Column(String, primary_key=True)
    dream_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String, nullable=False)
    url = Column(String)
    date = Column(DateTime, default=func.now())
    features = Column(JSON)
    code_snippets = Column(JSON)

class Implementation(Base):
    __tablename__ = "implementations"
    
    id = Column(String, primary_key=True)
    dream_id = Column(String, nullable=False)
    status = Column(String, default="pending")
    project_id = Column(String)
    tickets_created = Column(Integer, default=0)
    agents_assigned = Column(Integer, default=0)
    estimated_completion = Column(String)
    created_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime)
```

#### **Service Layer**
```python
# services/dreamcatcher/app/services/dream_service.py
from sqlalchemy.orm import Session
from ..models import Dream, Fragment
from ..clients import pipelineos_client

class DreamService:
    def __init__(self, db: Session):
        self.db = db

    async def import_dream(self, dream_data: dict):
        """Import dream from extension"""
        try:
            # Create dream
            dream = Dream(
                id=dream_data.get('id'),
                title=dream_data.get('title'),
                description=dream_data.get('description'),
                status=dream_data.get('status', 'idea'),
                tags=dream_data.get('tags', [])
            )
            
            self.db.add(dream)
            self.db.commit()
            
            # Create fragments
            for fragment_data in dream_data.get('fragments', []):
                fragment = Fragment(
                    id=fragment_data.get('id'),
                    dream_id=dream.id,
                    title=fragment_data.get('title'),
                    content=fragment_data.get('content'),
                    source=fragment_data.get('source'),
                    url=fragment_data.get('url'),
                    features=fragment_data.get('features', []),
                    code_snippets=fragment_data.get('codeSnippets', [])
                )
                self.db.add(fragment)
            
            self.db.commit()
            
            # Send to PipelineOS orchestrator
            pipelineos_result = await pipelineos_client.create_project_from_dream(dream_data)
            
            # Update dream with PipelineOS project ID
            dream.pipelineos_project_id = pipelineos_result.get('project_id')
            dream.synced_with_pipelineos = True
            dream.synced_at = func.now()
            
            self.db.commit()
            
            return {
                "success": True,
                "dream_id": dream.id,
                "project_id": pipelineos_result.get('project_id'),
                "tickets_created": pipelineos_result.get('tickets_created', 0),
                "agents_assigned": pipelineos_result.get('agents_assigned', 0),
                "estimated_completion": pipelineos_result.get('estimated_completion')
            }
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    async def implement_dream(self, dream_id: str):
        """Implement dream as project"""
        dream = self.db.query(Dream).filter(Dream.id == dream_id).first()
        if not dream:
            raise HTTPException(status_code=404, detail="Dream not found")
        
        # Implementation logic
        result = await pipelineos_client.implement_project(dream.pipelineos_project_id)
        
        # Update dream status
        dream.status = "completed"
        self.db.commit()
        
        return result
```

### **2. Extension Updates**

#### **Enhanced Content Script**
```javascript
// apps/extension/content.js
import { DreamcatcherAPI } from '@dreamcatcher/shared';

(function() {
  'use strict';

  let captureButton = null;
  let selectedText = '';
  let isCapturing = false;
  let currentModal = null;
  let pipelineOSConfig = null;

  // Initialize PipelineOS connection
  async function initializePipelineOS() {
    try {
      const result = await chrome.storage.local.get(['pipelineOSConfig']);
      pipelineOSConfig = result.pipelineOSConfig;
      
      if (pipelineOSConfig && pipelineOSConfig.enabled) {
        console.log('🔗 PipelineOS integration enabled');
        updateUIForPipelineOS();
      } else {
        console.log('📝 Standalone Dreamcatcher mode');
        updateUIForStandalone();
      }
    } catch (error) {
      console.error('Failed to initialize PipelineOS:', error);
    }
  }

  // Update UI based on mode
  function updateUIForPipelineOS() {
    if (captureButton) {
      captureButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>PipelineOS</span>
      `;
    }
  }

  function updateUIForStandalone() {
    if (captureButton) {
      captureButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Dreamcatcher</span>
      `;
    }
  }

  // Enhanced capture modal for PipelineOS
  function openCaptureModal() {
    if (currentModal) return;

    const modal = document.createElement('div');
    modal.className = 'dreamcatcher-modal-overlay';
    modal.innerHTML = `
      <div class="dreamcatcher-modal">
        <div class="dreamcatcher-modal-header">
          <h3>${pipelineOSConfig ? 'PipelineOS Capture' : 'Dreamcatcher Capture'}</h3>
          <button class="dreamcatcher-modal-close">&times;</button>
        </div>
        <div class="dreamcatcher-modal-body">
          <div class="dreamcatcher-capture-options">
            <label>
              <input type="radio" name="captureMode" value="all" checked>
              <span>Full Conversation</span>
            </label>
            <label>
              <input type="radio" name="captureMode" value="last5">
              <span>Last 5 Messages</span>
            </label>
            <label>
              <input type="radio" name="captureMode" value="selected">
              <span>Selected Text</span>
            </label>
          </div>
          
          <div class="dreamcatcher-project-section">
            <label for="projectName">Project Name:</label>
            <input type="text" id="projectName" placeholder="Auto-detected project name">
          </div>

          ${pipelineOSConfig ? `
            <div class="dreamcatcher-pipelineos-section">
              <label>
                <input type="checkbox" id="sendToPipelineOS" checked>
                <span>Send to PipelineOS for implementation</span>
              </label>
              <div class="dreamcatcher-pipelineos-options">
                <label>
                  <input type="checkbox" id="createProject" checked>
                  <span>Create new project</span>
                </label>
                <label>
                  <input type="checkbox" id="createTickets" checked>
                  <span>Create tickets from conversation</span>
                </label>
                <label>
                  <input type="checkbox" id="assignAgents" checked>
                  <span>Assign AI agents</span>
                </label>
              </div>
            </div>
          ` : ''}

          <div class="dreamcatcher-actions">
            <button class="dreamcatcher-btn dreamcatcher-btn-cancel">Cancel</button>
            <button class="dreamcatcher-btn dreamcatcher-btn-capture">
              ${pipelineOSConfig ? 'Capture & Send to PipelineOS' : 'Capture Dream'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    modal.querySelector('.dreamcatcher-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.dreamcatcher-btn-cancel').addEventListener('click', closeModal);
    modal.querySelector('.dreamcatcher-btn-capture').addEventListener('click', handleCapture);

    document.body.appendChild(modal);
    currentModal = modal;

    // Auto-detect project name
    autoDetectProjectName();
  }

  // Auto-detect project name from conversation
  function autoDetectProjectName() {
    const projectNameInput = document.getElementById('projectName');
    if (!projectNameInput) return;

    const conversation = extractConversation('all');
    const projectName = detectProjectName(conversation);
    
    if (projectName) {
      projectNameInput.value = projectName;
    }
  }

  // Enhanced capture handler
  async function handleCapture() {
    const captureMode = document.querySelector('input[name="captureMode"]:checked').value;
    const projectName = document.getElementById('projectName').value;
    
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    const conversation = extractConversation(captureMode);
    const fragmentData = {
      dreamName: projectName,
      fragmentTitle: generateFragmentTitle(conversation),
      content: conversation,
      source: platform,
      url: window.location.href,
      mode: captureMode
    };

    try {
      if (pipelineOSConfig && document.getElementById('sendToPipelineOS').checked) {
        // Send to PipelineOS
        await sendToPipelineOS(fragmentData);
        showNotification('✅ Captured and sent to PipelineOS!', 'success');
      } else {
        // Local capture (standalone mode)
        await chrome.runtime.sendMessage({
          action: 'capture',
          data: fragmentData
        });
        showNotification('✅ Dream captured!', 'success');
      }
      
      closeModal();
    } catch (error) {
      console.error('Capture error:', error);
      showNotification('❌ Capture failed: ' + error.message, 'error');
    }
  }

  // Send to PipelineOS
  async function sendToPipelineOS(data) {
    const pipelineOSOptions = {
      createProject: document.getElementById('createProject').checked,
      createTickets: document.getElementById('createTickets').checked,
      assignAgents: document.getElementById('assignAgents').checked
    };

    const payload = {
      dream: {
        title: data.dreamName,
        description: 'Captured from ' + data.source,
        status: 'idea',
        tags: ['browser-capture', data.source],
        fragments: [{
          title: data.fragmentTitle,
          content: data.content,
          source: data.source,
          url: data.url,
          features: extractFeatures(data.content),
          codeSnippets: extractCodeSnippets(data.content)
        }],
        pipelineOSOptions: pipelineOSOptions
      }
    };

    const response = await fetch(`${pipelineOSConfig.apiUrl}/api/v1/dreamcatcher/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pipelineOSConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`PipelineOS API error: ${response.status}`);
    }

    return await response.json();
  }

  // Initialize
  initializePipelineOS();
  createCaptureButton();

  // ... rest of existing functions
})();
```

#### **Enhanced Background Script**
```javascript
// apps/extension/background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'capture') {
    captureFragment(request.data).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Capture error:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (request.action === 'syncWithPipelineOS') {
    syncWithPipelineOS().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Sync error:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});

// Sync local dreams with PipelineOS
async function syncWithPipelineOS() {
  const result = await chrome.storage.local.get(['dreams', 'pipelineOSConfig']);
  const dreams = result.dreams || [];
  const config = result.pipelineOSConfig;

  if (!config || !config.enabled) {
    throw new Error('PipelineOS not configured');
  }

  for (const dream of dreams) {
    if (!dream.syncedWithPipelineOS) {
      try {
        await sendDreamToPipelineOS(dream, config);
        dream.syncedWithPipelineOS = true;
        dream.syncedAt = new Date().toISOString();
      } catch (error) {
        console.error(`Failed to sync dream ${dream.id}:`, error);
      }
    }
  }

  // Update storage
  await chrome.storage.local.set({ dreams });
}

// Send individual dream to PipelineOS
async function sendDreamToPipelineOS(dream, config) {
  const payload = {
    dream: {
      id: dream.id,
      title: dream.title,
      description: dream.description,
      status: dream.status,
      tags: dream.tags,
      created: dream.created,
      updated: dream.updated,
      fragments: dream.fragments
    }
  };

  const response = await fetch(`${config.apiUrl}/api/v1/dreamcatcher/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`PipelineOS API error: ${response.status}`);
  }

  return await response.json();
}

// ... rest of existing functions
```

### **3. Shared Packages**

#### **Types Package**
```typescript
// packages/types/src/index.ts
export interface Dream {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'in_progress' | 'completed';
  tags: string[];
  created: string;
  updated: string;
  fragments: Fragment[];
  syncedWithPipelineOS?: boolean;
  syncedAt?: string;
  pipelineOSProjectId?: string;
}

export interface Fragment {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  date: string;
  features: string[];
  codeSnippets: string[];
}

export interface PipelineOSConfig {
  enabled: boolean;
  apiUrl: string;
  apiKey: string;
  wsUrl: string;
}

export interface ImportResult {
  success: boolean;
  dream_id: string;
  project_id?: string;
  tickets_created?: number;
  agents_assigned?: number;
  estimated_completion?: string;
  error?: string;
}
```

#### **Shared API Client**
```typescript
// packages/shared/src/api.ts
import { Dream, ImportResult, PipelineOSConfig } from '@dreamcatcher/types';

export class DreamcatcherAPI {
  constructor(private config: PipelineOSConfig) {}
  
  async importDream(dream: Dream): Promise<ImportResult> {
    const response = await fetch(`${this.config.apiUrl}/api/v1/dreamcatcher/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dream })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }

  async captureConversation(conversationData: any): Promise<ImportResult> {
    const response = await fetch(`${this.config.apiUrl}/api/v1/conversations/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(conversationData)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }

  async getDreamStatus(dreamId: string): Promise<any> {
    const response = await fetch(`${this.config.apiUrl}/api/v1/dreams/${dreamId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
}
```

---

## 🔄 **Syncing Mechanism**

### **Real-Time Sync Manager**
```javascript
// packages/shared/src/sync-manager.js
class PipelineOSSyncManager {
  constructor() {
    this.syncInterval = null;
    this.isOnline = navigator.onLine;
    this.pendingSyncs = [];
    this.pipelineOSWebSocket = null;
  }

  async initializeSync() {
    const config = await this.getPipelineOSConfig();
    if (!config || !config.enabled) {
      console.log('PipelineOS sync disabled');
      return;
    }

    this.startPeriodicSync();
    this.connectToPipelineOS(config);
    
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.dreams) {
        this.queueSync();
      }
    });
  }

  async performSync() {
    if (!this.isOnline) {
      console.log('Offline - queuing sync');
      return;
    }

    try {
      const dreams = await this.getLocalDreams();
      const unsyncedDreams = dreams.filter(dream => !dream.syncedWithPipelineOS);
      
      if (unsyncedDreams.length === 0) {
        console.log('All dreams synced');
        return;
      }

      console.log(`Syncing ${unsyncedDreams.length} dreams to PipelineOS`);
      
      for (const dream of unsyncedDreams) {
        await this.syncDream(dream);
      }
      
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      this.queueSync();
    }
  }

  async syncDream(dream) {
    const config = await this.getPipelineOSConfig();
    
    const payload = {
      dream: {
        id: dream.id,
        title: dream.title,
        description: dream.description,
        status: dream.status,
        tags: dream.tags,
        created: dream.created,
        updated: dream.updated,
        fragments: dream.fragments
      }
    };

    const response = await fetch(`${config.apiUrl}/api/v1/dreamcatcher/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`PipelineOS API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Update local dream with sync status
    dream.syncedWithPipelineOS = true;
    dream.syncedAt = new Date().toISOString();
    dream.pipelineOSProjectId = result.project_id;
    
    await this.updateLocalDream(dream);
    
    return result;
  }

  connectToPipelineOS(config) {
    const wsUrl = `${config.wsUrl}/ws/dreamcatcher/${config.apiKey}`;
    
    this.pipelineOSWebSocket = new WebSocket(wsUrl);
    
    this.pipelineOSWebSocket.onopen = () => {
      console.log('Connected to PipelineOS WebSocket');
      this.isConnected = true;
      this.processSyncQueue();
    };
    
    this.pipelineOSWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handlePipelineOSMessage(message);
    };
    
    this.pipelineOSWebSocket.onclose = () => {
      console.log('Disconnected from PipelineOS WebSocket');
      this.isConnected = false;
      // Reconnect after 5 seconds
      setTimeout(() => this.connectToPipelineOS(config), 5000);
    };
  }

  async handlePipelineOSMessage(message) {
    switch (message.type) {
      case 'dream_updated':
        await this.updateLocalDream(message.dream);
        break;
      case 'dream_deleted':
        await this.deleteLocalDream(message.dreamId);
        break;
      case 'project_created':
        await this.updateDreamWithProject(message.dreamId, message.project);
        break;
      case 'implementation_completed':
        await this.updateDreamImplementation(message.dreamId, message.result);
        break;
    }
  }

  async updateLocalDream(pipelineOSDream) {
    const result = await chrome.storage.local.get(['dreams']);
    const dreams = result.dreams || [];
    
    const index = dreams.findIndex(d => d.id === pipelineOSDream.id);
    if (index !== -1) {
      dreams[index] = {
        ...dreams[index],
        ...pipelineOSDream,
        syncedWithPipelineOS: true,
        syncedAt: new Date().toISOString()
      };
      
      await chrome.storage.local.set({ dreams });
      
      // Show notification
      this.showNotification(`Dream "${pipelineOSDream.title}" updated from PipelineOS`, 'info');
    }
  }

  async updateDreamImplementation(dreamId, result) {
    const result = await chrome.storage.local.get(['dreams']);
    const dreams = result.dreams || [];
    
    const dream = dreams.find(d => d.id === dreamId);
    if (dream) {
      dream.status = 'completed';
      dream.implementation = result;
      dream.completedAt = new Date().toISOString();
      
      await chrome.storage.local.set({ dreams });
      
      // Show notification
      this.showNotification(`Dream "${dream.title}" has been implemented!`, 'success');
    }
  }

  showNotification(message, type) {
    chrome.runtime.sendMessage({
      action: 'showNotification',
      message: message,
      type: type
    });
  }

  async getPipelineOSConfig() {
    const result = await chrome.storage.local.get(['pipelineOSConfig']);
    return result.pipelineOSConfig;
  }

  async getLocalDreams() {
    const result = await chrome.storage.local.get(['dreams']);
    return result.dreams || [];
  }

  async updateLocalDream(dream) {
    const result = await chrome.storage.local.get(['dreams']);
    const dreams = result.dreams || [];
    
    const index = dreams.findIndex(d => d.id === dream.id);
    if (index !== -1) {
      dreams[index] = dream;
      await chrome.storage.local.set({ dreams });
    }
  }
}

// Initialize sync manager
const syncManager = new PipelineOSSyncManager();
```

---

## 📊 **Docker Compose Configuration**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Main Hub
  hub:
    build: ./apps/hub
    ports:
      - "3000:3000"
    environment:
      - CONNEX_API_URL=http://connex:8000
      - IPDE_API_URL=http://ipde:8000
      - BUILDER_ASSISTANT_API_URL=http://builder-assistant:8000
      - DREAMCATCHER_API_URL=http://dreamcatcher:8000
    depends_on:
      - orchestrator

  # Orchestrator Service
  orchestrator:
    build: ./services/orchestrator
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/pipelineos
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  # Dreamcatcher Microservice
  dreamcatcher:
    build: ./services/dreamcatcher
    ports:
      - "8004:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/pipelineos
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  # Standalone Dreamcatcher App
  dreamcatcher-app:
    build: ./apps/dreamcatcher
    ports:
      - "3003:3000"
    environment:
      - DREAMCATCHER_API_URL=http://dreamcatcher:8000
    depends_on:
      - dreamcatcher

  # Database
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=pipelineos
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 🎯 **Implementation Plan**

### **Phase 1: Service Extraction (Week 1)**
1. **Create Dreamcatcher Microservice**: Extract from MVP implementation
2. **Update Database Models**: Create service-specific models
3. **Implement Service Layer**: Business logic and API endpoints
4. **Add WebSocket Support**: Real-time updates

### **Phase 2: Extension Updates (Week 2)**
1. **Update Content Script**: Dual-mode operation
2. **Enhance Background Script**: Sync capabilities
3. **Add Configuration UI**: PipelineOS setup
4. **Implement Sync Manager**: Real-time bidirectional sync

### **Phase 3: Integration Testing (Week 3)**
1. **End-to-End Testing**: Complete workflow testing
2. **Performance Testing**: Load and stress testing
3. **Error Handling**: Robust error handling and recovery
4. **Documentation**: Complete implementation guides

---

## 🔐 **Security Considerations**

### **Authentication**
- JWT tokens for service authentication
- API key validation for external access
- WebSocket authentication with tokens
- Rate limiting on all endpoints

### **Data Protection**
- Encrypt sensitive data in transit and at rest
- Secure WebSocket connections (WSS)
- Input validation and sanitization
- SQL injection prevention

### **Access Control**
- Role-based access control (RBAC)
- Service-to-service authentication
- Audit logging for all operations
- Data isolation between users

---

## 📈 **Monitoring and Observability**

### **Logging**
- Structured logging with correlation IDs
- Service-specific log levels
- Centralized log aggregation
- Error tracking and alerting

### **Metrics**
- Service health checks
- Performance metrics (latency, throughput)
- Business metrics (dreams captured, sync success)
- Resource utilization monitoring

### **Tracing**
- Distributed tracing across services
- Request flow visualization
- Performance bottleneck identification
- Error root cause analysis

---

## 🎯 **Conclusion**

The microservices architecture provides:

- **Native Integration**: Direct service communication
- **Scalability**: Independent service scaling
- **Maintainability**: Service isolation and updates
- **Flexibility**: Standalone and integrated modes
- **Performance**: Optimized data flow and caching

**Success depends on proper implementation, testing, and monitoring.**

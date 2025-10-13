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

  async getDreams(): Promise<Dream[]> {
    const response = await fetch(`${this.config.apiUrl}/api/v1/dreams`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }

  async updateDream(dreamId: string, updates: Partial<Dream>): Promise<Dream> {
    const response = await fetch(`${this.config.apiUrl}/api/v1/dreams/${dreamId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }

  async deleteDream(dreamId: string): Promise<void> {
    const response = await fetch(`${this.config.apiUrl}/api/v1/dreams/${dreamId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  async implementDream(dreamId: string): Promise<any> {
    const response = await fetch(`${this.config.apiUrl}/api/v1/dreams/${dreamId}/implement`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }

  // WebSocket connection for real-time updates
  connectWebSocket(dreamId: string): WebSocket {
    const wsUrl = `${this.config.wsUrl}/ws/dreamcatcher/${dreamId}`;
    return new WebSocket(wsUrl);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/health`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Default API instance
let defaultAPI: DreamcatcherAPI | null = null;

export function getDefaultAPI(): DreamcatcherAPI | null {
  return defaultAPI;
}

export function setDefaultAPI(config: PipelineOSConfig): DreamcatcherAPI {
  defaultAPI = new DreamcatcherAPI(config);
  return defaultAPI;
}

// Utility functions
export async function testConnection(config: PipelineOSConfig): Promise<boolean> {
  const api = new DreamcatcherAPI(config);
  return await api.healthCheck();
}

export async function validateConfig(config: PipelineOSConfig): Promise<boolean> {
  if (!config.apiUrl || !config.apiKey) {
    return false;
  }
  
  try {
    return await testConnection(config);
  } catch (error) {
    return false;
  }
}

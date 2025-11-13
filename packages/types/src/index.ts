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
  brand?: string;
  summary?: string;
  todos?: Todo[];
  documents?: Document[];
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

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  deadline?: string;
  completedAt?: string;
  source?: 'manual' | 'ai_generated' | 'document_parsed';
  notes?: string;
  assignedTo?: string;
}

export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadDate: string;
  parsed: boolean;
  parsedData?: any;
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

export interface CaptureOptions {
  mode: 'all' | 'last5' | 'selected';
  projectName: string;
  sendToPipelineOS?: boolean;
  createProject?: boolean;
  createTickets?: boolean;
  assignAgents?: boolean;
}

export interface SyncStatus {
  totalDreams: number;
  syncedDreams: number;
  unsyncedDreams: number;
  lastSync?: string;
}

export interface DreamStatistics {
  fragmentCount: number;
  todoCount: number;
  completedTodos: number;
  documentCount: number;
  completionPercentage: number;
}

export interface Brand {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}

export interface Tag {
  id: string;
  name: string;
  category?: string;
  color?: string;
  description?: string;
  usageCount: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  preferences?: any;
  isActive: boolean;
  isVerified: boolean;
}

export interface WebSocketMessage {
  type: 'dream_updated' | 'dream_deleted' | 'project_created' | 'implementation_completed';
  dreamId: string;
  data?: any;
}

export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  message?: string;
}

// Event types for real-time updates
export type DreamEvent = 
  | { type: 'dream_created'; dream: Dream }
  | { type: 'dream_updated'; dream: Dream }
  | { type: 'dream_deleted'; dreamId: string }
  | { type: 'fragment_added'; fragment: Fragment; dreamId: string }
  | { type: 'todo_updated'; todo: Todo; dreamId: string }
  | { type: 'document_uploaded'; document: Document; dreamId: string }
  | { type: 'implementation_started'; dreamId: string }
  | { type: 'implementation_completed'; dreamId: string; result: any };

// Configuration types
export interface ExtensionConfig {
  version: string;
  pipelineOS: PipelineOSConfig;
  capture: {
    autoDetectProject: boolean;
    defaultCaptureMode: 'all' | 'last5' | 'selected';
    showNotifications: boolean;
  };
  sync: {
    enabled: boolean;
    interval: number; // minutes
    retryAttempts: number;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };
}

// API request/response types
export interface CreateDreamRequest {
  title: string;
  description?: string;
  tags?: string[];
  brand?: string;
  fragments?: Omit<Fragment, 'id' | 'date'>[];
}

export interface UpdateDreamRequest {
  title?: string;
  description?: string;
  status?: Dream['status'];
  tags?: string[];
  brand?: string;
  summary?: string;
  todos?: Todo[];
}

export interface CaptureConversationRequest {
  dreamName: string;
  fragmentTitle: string;
  content: string;
  source: string;
  url: string;
  mode: CaptureOptions['mode'];
  features?: string[];
  codeSnippets?: string[];
}

export interface SyncRequest {
  dreamIds?: string[];
  force?: boolean;
}

export interface SyncResponse {
  success: boolean;
  syncedDreams: number;
  failedDreams: number;
  errors?: string[];
}

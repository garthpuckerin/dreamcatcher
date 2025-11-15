"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineOSIntegration = void 0;
// src/pipelineos-integration.ts
const vscode = __importStar(require("vscode"));
const shared_1 = require("@dreamcatcher/shared");
class PipelineOSIntegration {
    constructor(context) {
        this.api = null;
        this.context = context;
        this.initializeAPI();
    }
    initializeAPI() {
        const config = vscode.workspace.getConfiguration('dreamcatcher');
        const enabled = config.get('pipelineOS.enabled', false);
        if (enabled) {
            const pipelineOSConfig = {
                enabled: true,
                apiUrl: config.get('pipelineOS.apiUrl', ''),
                apiKey: config.get('pipelineOS.apiKey', ''),
                wsUrl: config.get('pipelineOS.wsUrl', '')
            };
            if (pipelineOSConfig.apiUrl && pipelineOSConfig.apiKey) {
                this.api = new shared_1.DreamcatcherAPI(pipelineOSConfig);
            }
        }
    }
    async syncDreams() {
        if (!this.api) {
            vscode.window.showWarningMessage('PipelineOS integration not configured');
            return;
        }
        try {
            let syncedCount = 0;
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Syncing with PipelineOS...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });
                // Get local dreams
                const dreams = await this.getLocalDreams();
                progress.report({ increment: 25 });
                // Filter unsynced dreams
                const unsyncedDreams = dreams.filter(dream => !dream.syncedWithPipelineOS);
                progress.report({ increment: 50 });
                // Sync each dream
                for (const dream of unsyncedDreams) {
                    try {
                        await this.api.importDream(dream);
                        await this.markDreamAsSynced(dream.id);
                        syncedCount++;
                    }
                    catch (error) {
                        console.error(`Failed to sync dream ${dream.id}:`, error);
                    }
                }
                progress.report({ increment: 100 });
            });
            vscode.window.showInformationMessage(`✅ Synced ${syncedCount} dreams with PipelineOS!`);
        }
        catch (error) {
            console.error('Sync error:', error);
            vscode.window.showErrorMessage(`❌ Failed to sync with PipelineOS: ${error}`);
        }
    }
    async sendDreamToPipelineOS(dream) {
        if (!this.api) {
            vscode.window.showWarningMessage('PipelineOS integration not configured');
            return;
        }
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Sending dream to PipelineOS...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });
                const result = await this.api.importDream(dream);
                progress.report({ increment: 50 });
                await this.markDreamAsSynced(dream.id);
                progress.report({ increment: 100 });
            });
            vscode.window.showInformationMessage(`✅ Dream "${dream.title}" sent to PipelineOS!`);
        }
        catch (error) {
            console.error('Send error:', error);
            vscode.window.showErrorMessage(`❌ Failed to send dream to PipelineOS: ${error}`);
        }
    }
    async getDreamStatus(dreamId) {
        if (!this.api) {
            throw new Error('PipelineOS integration not configured');
        }
        try {
            return await this.api.getDreamStatus(dreamId);
        }
        catch (error) {
            console.error('Status check error:', error);
            throw error;
        }
    }
    async implementDream(dreamId) {
        if (!this.api) {
            vscode.window.showWarningMessage('PipelineOS integration not configured');
            return;
        }
        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Implementing dream...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });
                const result = await this.api.implementDream(dreamId);
                progress.report({ increment: 100 });
            });
            vscode.window.showInformationMessage(`✅ Dream implementation started!`);
        }
        catch (error) {
            console.error('Implementation error:', error);
            vscode.window.showErrorMessage(`❌ Failed to implement dream: ${error}`);
        }
    }
    async testConnection() {
        if (!this.api) {
            return false;
        }
        try {
            return await this.api.healthCheck();
        }
        catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
    async getLocalDreams() {
        // This would integrate with the storage manager
        // For now, return empty array
        return [];
    }
    async markDreamAsSynced(dreamId) {
        // This would update the dream in local storage
        // For now, just log
        console.log(`Marked dream ${dreamId} as synced`);
    }
    // WebSocket connection for real-time updates
    connectWebSocket() {
        if (!this.api) {
            return null;
        }
        const config = vscode.workspace.getConfiguration('dreamcatcher');
        const wsUrl = config.get('pipelineOS.wsUrl', '');
        const apiKey = config.get('pipelineOS.apiKey', '');
        if (!wsUrl || !apiKey) {
            return null;
        }
        try {
            const ws = new WebSocket(`${wsUrl}/ws/dreamcatcher/${apiKey}`);
            ws.onopen = () => {
                console.log('Connected to PipelineOS WebSocket');
            };
            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleWebSocketMessage(message);
                }
                catch (error) {
                    console.error('WebSocket message error:', error);
                }
            };
            ws.onclose = () => {
                console.log('Disconnected from PipelineOS WebSocket');
                // Reconnect after 5 seconds
                setTimeout(() => this.connectWebSocket(), 5000);
            };
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            return ws;
        }
        catch (error) {
            console.error('WebSocket connection error:', error);
            return null;
        }
    }
    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'dream_updated':
                this.handleDreamUpdate(message.dream);
                break;
            case 'dream_deleted':
                this.handleDreamDeletion(message.dreamId);
                break;
            case 'project_created':
                this.handleProjectCreation(message.dreamId, message.project);
                break;
            case 'implementation_completed':
                this.handleImplementationCompletion(message.dreamId, message.result);
                break;
            default:
                console.log('Unknown WebSocket message type:', message.type);
        }
    }
    handleDreamUpdate(dream) {
        vscode.window.showInformationMessage(`Dream "${dream.title}" updated from PipelineOS`);
        // Refresh tree view
        vscode.commands.executeCommand('dreamcatcher-dreams.refresh');
    }
    handleDreamDeletion(dreamId) {
        vscode.window.showInformationMessage(`Dream deleted from PipelineOS`);
        // Refresh tree view
        vscode.commands.executeCommand('dreamcatcher-dreams.refresh');
    }
    handleProjectCreation(dreamId, project) {
        vscode.window.showInformationMessage(`Project created from dream: ${project.name}`);
    }
    handleImplementationCompletion(dreamId, result) {
        vscode.window.showInformationMessage(`Dream implementation completed!`);
    }
}
exports.PipelineOSIntegration = PipelineOSIntegration;
//# sourceMappingURL=pipelineos-integration.js.map
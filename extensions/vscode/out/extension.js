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
exports.deactivate = exports.activate = void 0;
// src/extension.ts
const vscode = __importStar(require("vscode"));
const dreamcatcher_provider_1 = require("./dreamcatcher-provider");
const conversation_capture_1 = require("./conversation-capture");
const pipelineos_integration_1 = require("./pipelineos-integration");
const storage_manager_1 = require("./storage-manager");
function activate(context) {
    console.log('Dreamcatcher extension is now active!');
    // Initialize components
    const storageManager = new storage_manager_1.StorageManager(context);
    const conversationCapture = new conversation_capture_1.ConversationCapture(storageManager);
    const pipelineOSIntegration = new pipelineos_integration_1.PipelineOSIntegration(context);
    const dreamcatcherProvider = new dreamcatcher_provider_1.DreamcatcherProvider(storageManager);
    // Register commands
    const captureCommand = vscode.commands.registerCommand('dreamcatcher.captureConversation', async () => {
        await conversationCapture.captureConversation();
    });
    const dashboardCommand = vscode.commands.registerCommand('dreamcatcher.openDashboard', async () => {
        await openDashboard();
    });
    const syncCommand = vscode.commands.registerCommand('dreamcatcher.syncWithPipelineOS', async () => {
        await pipelineOSIntegration.syncDreams();
    });
    const createDreamCommand = vscode.commands.registerCommand('dreamcatcher.createDreamFromSelection', async () => {
        await createDreamFromSelection(conversationCapture);
    });
    const quickCaptureCommand = vscode.commands.registerCommand('dreamcatcher.quickCapture', async () => {
        await quickCapture(conversationCapture);
    });
    // Register tree data provider
    vscode.window.createTreeView('dreamcatcher-dreams', {
        treeDataProvider: dreamcatcherProvider,
        showCollapseAll: true
    });
    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(lightbulb) Dreamcatcher";
    statusBarItem.tooltip = "Dreamcatcher: Capture AI conversations";
    statusBarItem.command = 'dreamcatcher.captureConversation';
    statusBarItem.show();
    // Register configuration change listener
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('dreamcatcher')) {
            updateConfiguration();
        }
    });
    // Register text selection change listener
    const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection(event => {
        const selection = event.selections[0];
        if (!selection.isEmpty) {
            // Show quick action for selected text
            showQuickActionForSelection(selection);
        }
    });
    // Register document change listener for auto-capture
    const documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.workspace.getConfiguration('dreamcatcher').get('autoCapture')) {
            handleDocumentChange(event);
        }
    });
    // Add to subscriptions
    context.subscriptions.push(captureCommand, dashboardCommand, syncCommand, createDreamCommand, quickCaptureCommand, statusBarItem, configChangeListener, selectionChangeListener, documentChangeListener);
    // Initialize configuration
    updateConfiguration();
    // Show welcome message
    showWelcomeMessage();
}
exports.activate = activate;
function deactivate() {
    console.log('Dreamcatcher extension is now deactivated');
}
exports.deactivate = deactivate;
async function openDashboard() {
    // Open Dreamcatcher web dashboard
    const dashboardUrl = vscode.workspace.getConfiguration('dreamcatcher').get('dashboardUrl', 'http://localhost:3000');
    vscode.env.openExternal(vscode.Uri.parse(dashboardUrl));
}
async function createDreamFromSelection(conversationCapture) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
    }
    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showWarningMessage('No text selected');
        return;
    }
    const selectedText = editor.document.getText(selection);
    await conversationCapture.captureFromText(selectedText, editor.document.fileName);
}
async function quickCapture(conversationCapture) {
    // Quick capture from clipboard or current document
    const clipboardText = await vscode.env.clipboard.readText();
    if (clipboardText) {
        await conversationCapture.captureFromText(clipboardText, 'clipboard');
    }
    else {
        vscode.window.showWarningMessage('Clipboard is empty');
    }
}
function showQuickActionForSelection(selection) {
    // Show quick action for selected text
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = [
        {
            label: '$(lightbulb) Create Dream from Selection',
            description: 'Capture selected text as a new dream',
            detail: 'Turn this code or text into an actionable project'
        },
        {
            label: '$(comment-discussion) Add to Existing Dream',
            description: 'Add selected text to an existing dream',
            detail: 'Append this content to a dream you\'re working on'
        }
    ];
    quickPick.onDidChangeSelection(selection => {
        if (selection[0]) {
            if (selection[0].label.includes('Create Dream')) {
                vscode.commands.executeCommand('dreamcatcher.createDreamFromSelection');
            }
            else if (selection[0].label.includes('Add to Existing')) {
                // Show dream selection
                showDreamSelection();
            }
        }
        quickPick.hide();
    });
    quickPick.show();
}
async function showDreamSelection() {
    // Show list of existing dreams to add content to
    const storageManager = new storage_manager_1.StorageManager(vscode.workspace.workspaceFolders?.[0]?.uri || vscode.Uri.file(''));
    const dreams = await storageManager.getDreams();
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = dreams.map(dream => ({
        label: dream.title,
        description: dream.description,
        detail: `${dream.fragments.length} fragments, ${dream.status}`
    }));
    quickPick.onDidChangeSelection(selection => {
        if (selection[0]) {
            // Add selected text to chosen dream
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selectedText = editor.document.getText(editor.selection);
                // Implementation for adding to existing dream
            }
        }
        quickPick.hide();
    });
    quickPick.show();
}
function updateConfiguration() {
    const config = vscode.workspace.getConfiguration('dreamcatcher');
    // Update storage manager configuration
    const storageType = config.get('storage.type', 'local');
    const maxDreams = config.get('limits.maxDreams', 50);
    // Update PipelineOS configuration
    const pipelineOSEnabled = config.get('pipelineOS.enabled', false);
    const pipelineOSUrl = config.get('pipelineOS.apiUrl', '');
    const pipelineOSKey = config.get('pipelineOS.apiKey', '');
    // Update Supabase configuration
    const supabaseUrl = config.get('supabase.url', '');
    const supabaseKey = config.get('supabase.key', '');
    console.log('Dreamcatcher configuration updated:', {
        storageType,
        maxDreams,
        pipelineOSEnabled,
        supabaseUrl: supabaseUrl ? 'configured' : 'not configured'
    });
}
function showWelcomeMessage() {
    const config = vscode.workspace.getConfiguration('dreamcatcher');
    const hasShownWelcome = config.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage('Welcome to Dreamcatcher! Use Ctrl+Shift+C to capture AI conversations.', 'Open Dashboard', 'Configure').then(selection => {
            if (selection === 'Open Dashboard') {
                vscode.commands.executeCommand('dreamcatcher.openDashboard');
            }
            else if (selection === 'Configure') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'dreamcatcher');
            }
        });
        // Mark welcome as shown
        config.update('hasShownWelcome', true, vscode.ConfigurationTarget.Global);
    }
}
function handleDocumentChange(event) {
    // Auto-capture logic for AI conversations
    const changes = event.contentChanges;
    for (const change of changes) {
        if (change.text.includes('```') || change.text.includes('def ') || change.text.includes('function ')) {
            // Potential code or AI conversation detected
            // Implement auto-capture logic
        }
    }
}
//# sourceMappingURL=extension.js.map
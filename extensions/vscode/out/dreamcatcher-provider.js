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
exports.DreamcatcherItem = exports.DreamcatcherProvider = void 0;
// src/dreamcatcher-provider.ts
const vscode = __importStar(require("vscode"));
class DreamcatcherProvider {
    constructor(storageManager) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.storageManager = storageManager;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // Root level - show dreams
            return this.getDreams();
        }
        else if (element.type === 'dream') {
            // Dream level - show fragments
            return this.getFragments(element.dream);
        }
        else if (element.type === 'fragment') {
            // Fragment level - show details
            return this.getFragmentDetails(element.fragment);
        }
        return [];
    }
    async getDreams() {
        try {
            const dreams = await this.storageManager.getDreams();
            return dreams.map(dream => new DreamcatcherItem(dream.title, vscode.TreeItemCollapsibleState.Collapsed, 'dream', dream, undefined));
        }
        catch (error) {
            console.error('Error loading dreams:', error);
            return [];
        }
    }
    async getFragments(dream) {
        return dream.fragments.map(fragment => new DreamcatcherItem(fragment.title, vscode.TreeItemCollapsibleState.Collapsed, 'fragment', dream, fragment));
    }
    async getFragmentDetails(fragment) {
        const items = [];
        // Add features
        if (fragment.features.length > 0) {
            items.push(new DreamcatcherItem(`Features (${fragment.features.length})`, vscode.TreeItemCollapsibleState.Collapsed, 'features', undefined, fragment));
        }
        // Add code snippets
        if (fragment.codeSnippets.length > 0) {
            items.push(new DreamcatcherItem(`Code Snippets (${fragment.codeSnippets.length})`, vscode.TreeItemCollapsibleState.Collapsed, 'code-snippets', undefined, fragment));
        }
        // Add source info
        items.push(new DreamcatcherItem(`Source: ${fragment.source}`, vscode.TreeItemCollapsibleState.None, 'source', undefined, fragment));
        // Add date
        items.push(new DreamcatcherItem(`Date: ${new Date(fragment.date).toLocaleDateString()}`, vscode.TreeItemCollapsibleState.None, 'date', undefined, fragment));
        return items;
    }
}
exports.DreamcatcherProvider = DreamcatcherProvider;
class DreamcatcherItem extends vscode.TreeItem {
    constructor(label, collapsibleState, type, dream, fragment) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.type = type;
        this.dream = dream;
        this.fragment = fragment;
        this.tooltip = this.getTooltip();
        this.iconPath = this.getIcon();
        this.contextValue = this.getContextValue();
    }
    getTooltip() {
        switch (this.type) {
            case 'dream':
                return `Dream: ${this.dream?.title}\nStatus: ${this.dream?.status}\nFragments: ${this.dream?.fragments.length}`;
            case 'fragment':
                return `Fragment: ${this.fragment?.title}\nSource: ${this.fragment?.source}`;
            case 'features':
                return `Features: ${this.fragment?.features.join(', ')}`;
            case 'code-snippets':
                return `Code Snippets: ${this.fragment?.codeSnippets.length} snippets`;
            case 'source':
                return `Source: ${this.fragment?.source}`;
            case 'date':
                return `Date: ${this.fragment?.date}`;
            default:
                return this.label;
        }
    }
    getIcon() {
        switch (this.type) {
            case 'dream':
                return new vscode.ThemeIcon('lightbulb');
            case 'fragment':
                return new vscode.ThemeIcon('file-text');
            case 'features':
                return new vscode.ThemeIcon('list');
            case 'code-snippets':
                return new vscode.ThemeIcon('code');
            case 'source':
                return new vscode.ThemeIcon('link');
            case 'date':
                return new vscode.ThemeIcon('calendar');
            default:
                return new vscode.ThemeIcon('circle');
        }
    }
    getContextValue() {
        switch (this.type) {
            case 'dream':
                return 'dreamcatcher.dream';
            case 'fragment':
                return 'dreamcatcher.fragment';
            case 'features':
                return 'dreamcatcher.features';
            case 'code-snippets':
                return 'dreamcatcher.code-snippets';
            default:
                return 'dreamcatcher.item';
        }
    }
}
exports.DreamcatcherItem = DreamcatcherItem;
//# sourceMappingURL=dreamcatcher-provider.js.map
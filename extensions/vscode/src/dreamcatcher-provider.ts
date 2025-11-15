// src/dreamcatcher-provider.ts
import * as vscode from 'vscode';
import { StorageManager } from './storage-manager';
import { Dream, Fragment } from '@dreamcatcher/types';

export class DreamcatcherProvider implements vscode.TreeDataProvider<DreamcatcherItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<DreamcatcherItem | undefined | null | void> = new vscode.EventEmitter<DreamcatcherItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<DreamcatcherItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private storageManager: StorageManager;

    constructor(storageManager: StorageManager) {
        this.storageManager = storageManager;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: DreamcatcherItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: DreamcatcherItem): Promise<DreamcatcherItem[]> {
        if (!element) {
            // Root level - show dreams
            return this.getDreams();
        } else if (element.type === 'dream') {
            // Dream level - show fragments
            return this.getFragments(element.dream);
        } else if (element.type === 'fragment') {
            // Fragment level - show details
            return this.getFragmentDetails(element.fragment);
        }

        return [];
    }

    private async getDreams(): Promise<DreamcatcherItem[]> {
        try {
            const dreams = await this.storageManager.getDreams();
            return dreams.map(dream => new DreamcatcherItem(
                dream.title,
                vscode.TreeItemCollapsibleState.Collapsed,
                'dream',
                dream,
                undefined
            ));
        } catch (error) {
            console.error('Error loading dreams:', error);
            return [];
        }
    }

    private async getFragments(dream: Dream): Promise<DreamcatcherItem[]> {
        return dream.fragments.map(fragment => new DreamcatcherItem(
            fragment.title,
            vscode.TreeItemCollapsibleState.Collapsed,
            'fragment',
            dream,
            fragment
        ));
    }

    private async getFragmentDetails(fragment: Fragment): Promise<DreamcatcherItem[]> {
        const items: DreamcatcherItem[] = [];

        // Add features
        if (fragment.features.length > 0) {
            items.push(new DreamcatcherItem(
                `Features (${fragment.features.length})`,
                vscode.TreeItemCollapsibleState.Collapsed,
                'features',
                undefined,
                fragment
            ));
        }

        // Add code snippets
        if (fragment.codeSnippets.length > 0) {
            items.push(new DreamcatcherItem(
                `Code Snippets (${fragment.codeSnippets.length})`,
                vscode.TreeItemCollapsibleState.Collapsed,
                'code-snippets',
                undefined,
                fragment
            ));
        }

        // Add source info
        items.push(new DreamcatcherItem(
            `Source: ${fragment.source}`,
            vscode.TreeItemCollapsibleState.None,
            'source',
            undefined,
            fragment
        ));

        // Add date
        items.push(new DreamcatcherItem(
            `Date: ${new Date(fragment.date).toLocaleDateString()}`,
            vscode.TreeItemCollapsibleState.None,
            'date',
            undefined,
            fragment
        ));

        return items;
    }
}

export class DreamcatcherItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'dream' | 'fragment' | 'features' | 'code-snippets' | 'source' | 'date',
        public readonly dream?: Dream,
        public readonly fragment?: Fragment
    ) {
        super(label, collapsibleState);

        this.tooltip = this.getTooltip();
        this.iconPath = this.getIcon();
        this.contextValue = this.getContextValue();
    }

    private getTooltip(): string {
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

    private getIcon(): vscode.ThemeIcon {
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

    private getContextValue(): string {
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

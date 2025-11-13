// src/conversation-capture.ts
import * as vscode from 'vscode';
import { StorageManager } from './storage-manager';
import { Dream, Fragment } from '@dreamcatcher/types';

export class ConversationCapture {
    private storageManager: StorageManager;

    constructor(storageManager: StorageManager) {
        this.storageManager = storageManager;
    }

    async captureConversation() {
        // Show input box for conversation content
        const conversationText = await vscode.window.showInputBox({
            prompt: 'Enter AI conversation or code to capture',
            placeHolder: 'Paste your ChatGPT, Claude, or other AI conversation here...',
            ignoreFocusOut: true,
            validateInput: (text) => {
                if (!text || text.trim().length === 0) {
                    return 'Please enter some content to capture';
                }
                if (text.length > 10000) {
                    return 'Content is too long. Please keep it under 10,000 characters.';
                }
                return null;
            }
        });

        if (!conversationText) {
            return;
        }

        // Show project name input
        const projectName = await vscode.window.showInputBox({
            prompt: 'Project Name',
            placeHolder: 'Enter a name for this project/dream...',
            value: this.autoDetectProjectName(conversationText),
            ignoreFocusOut: true,
            validateInput: (text) => {
                if (!text || text.trim().length === 0) {
                    return 'Please enter a project name';
                }
                return null;
            }
        });

        if (!projectName) {
            return;
        }

        // Capture the conversation
        await this.captureFromText(conversationText, projectName);
    }

    async captureFromText(text: string, source: string) {
        try {
            let dream: any;

            // Show progress
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Capturing conversation...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });

                // Create dream
                dream = await this.createDream(text, source);
                progress.report({ increment: 50 });

                // Save to storage
                await this.storageManager.saveDream(dream);
                progress.report({ increment: 100 });
            });

            if (dream) {
                vscode.window.showInformationMessage(`✅ Dream "${dream.title}" captured successfully!`);
            }
            
            // Refresh the tree view
            vscode.commands.executeCommand('dreamcatcher-dreams.refresh');

        } catch (error) {
            console.error('Capture error:', error);
            vscode.window.showErrorMessage(`❌ Failed to capture conversation: ${error}`);
        }
    }

    private async createDream(text: string, source: string): Promise<Dream> {
        const config = vscode.workspace.getConfiguration('dreamcatcher');
        const autoTagging = config.get('features.autoTagging', true);
        const autoSummarization = config.get('features.autoSummarization', true);

        // Generate dream ID
        const dreamId = this.generateId();

        // Create fragment
        const fragment: Fragment = {
            id: this.generateId(),
            title: this.generateFragmentTitle(text),
            content: text,
            source: source,
            url: vscode.window.activeTextEditor?.document.uri.toString() || '',
            date: new Date().toISOString(),
            features: this.extractFeatures(text),
            codeSnippets: this.extractCodeSnippets(text)
        };

        // Generate tags
        const tags = autoTagging ? this.generateTags(text) : ['manual-capture'];

        // Generate summary
        const summary = autoSummarization ? this.generateSummary(text) : '';

        // Create dream
        const dream: Dream = {
            id: dreamId,
            title: this.autoDetectProjectName(text),
            description: `Captured from ${source}`,
            status: 'idea',
            tags: tags,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            fragments: [fragment],
            summary: summary,
            brand: 'personal'
        };

        return dream;
    }

    private autoDetectProjectName(text: string): string {
        // Simple project name detection
        const patterns = [
            /(?:create|build|develop|make)\s+(?:a\s+)?([a-zA-Z0-9\s-]+?)(?:\s+(?:app|website|tool|system|platform))/i,
            /(?:project|app|website|tool|system|platform)\s+(?:called|named|is)\s+([a-zA-Z0-9\s-]+)/i,
            /^([a-zA-Z0-9\s-]+?)(?:\s+(?:app|website|tool|system|platform))/i,
            /(?:let's|we'll|i'll)\s+(?:build|create|make)\s+(?:a\s+)?([a-zA-Z0-9\s-]+)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }

        // Fallback to first line or generic name
        const firstLine = text.split('\n')[0].trim();
        if (firstLine.length > 0 && firstLine.length < 50) {
            return firstLine;
        }

        return 'New Project';
    }

    private generateFragmentTitle(text: string): string {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
            const firstLine = lines[0].trim();
            return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
        }
        return 'Captured Content';
    }

    private extractFeatures(text: string): string[] {
        const features: string[] = [];
        const featurePatterns = [
            /(?:feature|function|capability):\s*([^\n]+)/gi,
            /(?:should|needs? to|must)\s+([^\n]+)/gi,
            /(?:implement|add|create)\s+([^\n]+)/gi,
            /(?:requirements?|specs?):\s*([^\n]+)/gi
        ];

        featurePatterns.forEach(pattern => {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    features.push(match[1].trim());
                }
            }
        });

        return [...new Set(features)]; // Remove duplicates
    }

    private extractCodeSnippets(text: string): string[] {
        const codeSnippets: string[] = [];
        const codePatterns = [
            /```[\s\S]*?```/g,
            /`[^`]+`/g,
            /<code>[\s\S]*?<\/code>/g
        ];

        codePatterns.forEach(pattern => {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                if (match[0]) {
                    codeSnippets.push(match[0].trim());
                }
            }
        });

        return [...new Set(codeSnippets)]; // Remove duplicates
    }

    private generateTags(text: string): string[] {
        const tags: string[] = [];
        const textLower = text.toLowerCase();

        // Technology tags
        if (textLower.includes('react')) tags.push('react');
        if (textLower.includes('vue')) tags.push('vue');
        if (textLower.includes('angular')) tags.push('angular');
        if (textLower.includes('node')) tags.push('nodejs');
        if (textLower.includes('python')) tags.push('python');
        if (textLower.includes('javascript')) tags.push('javascript');
        if (textLower.includes('typescript')) tags.push('typescript');
        if (textLower.includes('sql')) tags.push('database');
        if (textLower.includes('api')) tags.push('api');
        if (textLower.includes('frontend')) tags.push('frontend');
        if (textLower.includes('backend')) tags.push('backend');
        if (textLower.includes('fullstack')) tags.push('fullstack');

        // Project type tags
        if (textLower.includes('web app')) tags.push('web-app');
        if (textLower.includes('mobile app')) tags.push('mobile-app');
        if (textLower.includes('desktop app')) tags.push('desktop-app');
        if (textLower.includes('ecommerce')) tags.push('ecommerce');
        if (textLower.includes('dashboard')) tags.push('dashboard');
        if (textLower.includes('blog')) tags.push('blog');
        if (textLower.includes('portfolio')) tags.push('portfolio');

        // Add default tags
        tags.push('vscode-capture', 'ai-conversation');

        return [...new Set(tags)]; // Remove duplicates
    }

    private generateSummary(text: string): string {
        // Simple summarization - take first few sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length <= 3) {
            return text.substring(0, 200) + (text.length > 200 ? '...' : '');
        }
        return sentences.slice(0, 2).join('. ') + '.';
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

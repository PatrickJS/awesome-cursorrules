import * as vscode from 'vscode';
import { LanguageDetector } from './languageDetector';

export function activate(context: vscode.ExtensionContext) {
    const languageDetector = new LanguageDetector();
    
    // Register a file system watcher
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    
    // Handle file changes
    watcher.onDidChange(async (uri) => {
        const language = languageDetector.detectLanguage(uri);
        if (language !== 'unknown') {
            // Process file changes based on language
            console.log(`File changed: ${uri.fsPath}, Language: ${language}`);
        }
    });

    context.subscriptions.push(watcher);
}

export function deactivate() {} 
import * as vscode from 'vscode';
import { MarkdownConverter } from './converter/markdownConverter';
import { TemplateService } from './templates/templateService';

export function activate(context: vscode.ExtensionContext): void {
    console.log('Cursor Rules Dynamic extension is now active');

    // Create status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = "$(eye) CursorRules";
    statusBarItem.tooltip = "Cursor Rules Dynamic is active";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    
    // Handle active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                const languageId = editor.document.languageId;
                updateStatusBar(statusBarItem, languageId);
            }
        })
    );

    // Handle file changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    watcher.onDidChange(async (uri) => {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const languageId = document.languageId;
            
            // Process file changes based on language
            const message = `Processing ${languageId} file: ${uri.fsPath}`;
            console.log(message);
            void vscode.window.showInformationMessage(message);
            updateStatusBar(statusBarItem, languageId);
        } catch (error) {
            console.error('Error processing file:', error);
        }
    });

    // Register convert command
    const convertCommand = vscode.commands.registerCommand('cursor-rules-dynamic.convertToJson', async (uri?: vscode.Uri) => {
        try {
            // If URI not provided through context menu, show file picker
            if (!uri) {
                const files = await vscode.workspace.findFiles('**/.cursorrules');
                if (files.length === 0) {
                    void vscode.window.showErrorMessage('No .cursorrules files found in workspace');
                    return;
                }

                const selected = await vscode.window.showQuickPick(
                    files.map(f => ({ label: vscode.workspace.asRelativePath(f), uri: f })),
                    { placeHolder: 'Select .cursorrules file to convert' }
                );
                
                if (!selected) {
                    return;
                }
                uri = selected.uri;
            }

            // Show preview first
            await MarkdownConverter.showPreview(uri);

            // Wait for user to review and possibly edit the preview
            const choice = await vscode.window.showWarningMessage(
                'Review the preview and make any needed edits. Would you like to proceed with the conversion?',
                { modal: true },
                'Convert',
                'Cancel'
            );

            if (choice === 'Convert' && MarkdownConverter.hasActivePreview()) {
                // Convert the file with possibly edited content
                await MarkdownConverter.convertFile(uri);
                void vscode.window.showInformationMessage(
                    `Successfully converted ${vscode.workspace.asRelativePath(uri)} to JSON format. Original file backed up.`
                );
            } else {
                void vscode.window.showInformationMessage('Conversion cancelled.');
            }
        } catch (error) {
            void vscode.window.showErrorMessage(
                `Failed to convert file: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    });

    // Register status command
    const statusCommand = vscode.commands.registerCommand('cursor-rules-dynamic.showStatus', () => {
        const editor = vscode.window.activeTextEditor;
        const languageId = editor?.document.languageId || 'none';
        const message = `Cursor Rules Dynamic is active and monitoring ${languageId} files`;
        void vscode.window.showInformationMessage(message);
    });

    // Register template browsing command
    const templateService = new TemplateService(context.extensionPath);
    const browseTemplatesCommand = vscode.commands.registerCommand('cursor-rules-dynamic.browseTemplates', async () => {
        try {
            // Get template categories
            const categories = await templateService.getTemplateCategories();
            
            // Let user select a category
            const selectedCategory = await vscode.window.showQuickPick(categories, {
                placeHolder: 'Select a template category'
            });
            
            if (!selectedCategory) {
                return;
            }
            
            // Get templates in selected category
            const templates = await templateService.getTemplatesInCategory(selectedCategory);
            
            // Let user select a template
            const selectedTemplate = await vscode.window.showQuickPick(
                templates.map(t => ({
                    label: t.name,
                    description: t.description,
                    template: t
                })),
                {
                    placeHolder: 'Select a template to preview'
                }
            );
            
            if (selectedTemplate) {
                // Preview the selected template
                await templateService.createTemplatePreview(selectedTemplate.template);
            }
        } catch (error) {
            void vscode.window.showErrorMessage(`Error browsing templates: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(watcher);
    context.subscriptions.push(convertCommand);
    context.subscriptions.push(statusCommand);
    context.subscriptions.push(browseTemplatesCommand);

    // Update status for initial active editor
    if (vscode.window.activeTextEditor) {
        updateStatusBar(statusBarItem, vscode.window.activeTextEditor.document.languageId);
    }
}

function updateStatusBar(statusBarItem: vscode.StatusBarItem, languageId: string): void {
    statusBarItem.text = `$(eye) CursorRules [${languageId}]`;
    statusBarItem.tooltip = `Monitoring ${languageId} files`;
}

export function deactivate(): void {
    console.log('Cursor Rules Dynamic extension is now deactivated');
} 
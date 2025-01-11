import * as vscode from 'vscode';
import { TextConverter } from './converter/textConverter';
import { TemplateService } from './templates/templateService';

export function activate(context: vscode.ExtensionContext): void {
    console.log('Cursor Rules Dynamic extension is now active');

    // Create status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = "$(eye) CursorRules";
    statusBarItem.tooltip = "Cursor Rules Dynamic is active and monitoring .cursorrules files";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    
    // Handle active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                updateStatusBar(statusBarItem);
            }
        })
    );

    // Handle file changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    watcher.onDidChange((uri) => {
        try {
            const message = `Processing file: ${uri.fsPath}`;
            console.log(message);
            void vscode.window.showInformationMessage(message);
            updateStatusBar(statusBarItem);
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
            await TextConverter.showPreview(uri);

            // Convert the file if preview is active
            if (TextConverter.hasActivePreview()) {
                await TextConverter.convertFile(uri);
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
        void vscode.window.showInformationMessage('Cursor Rules Dynamic is active and monitoring .cursorrules files');
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
                
                // Ask if user wants to save the template
                const choice = await vscode.window.showInformationMessage(
                    'Would you like to save this template as your .cursorrules file?',
                    'Save',
                    'Cancel'
                );
                
                if (choice === 'Save') {
                    await templateService.saveTemplateToWorkspace(selectedTemplate.template);
                }
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
        updateStatusBar(statusBarItem);
    }
}

function updateStatusBar(statusBarItem: vscode.StatusBarItem): void {
    statusBarItem.text = `$(eye) CursorRules`;
    statusBarItem.tooltip = `Cursor Rules Dynamic is active and monitoring .cursorrules files`;
}

export function deactivate(): void {
    console.log('Cursor Rules Dynamic extension is now deactivated');
} 
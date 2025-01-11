import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface RuleTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    content: string;
}

export class TemplateService {
    private readonly rulesPath: string;

    constructor(extensionPath: string) {
        this.rulesPath = path.join(path.dirname(extensionPath), 'rules');
    }

    public async getTemplateCategories(): Promise<string[]> {
        try {
            const entries = await fs.promises.readdir(this.rulesPath, { withFileTypes: true });
            return entries
                .filter(entry => entry.isDirectory())
                .map(entry => entry.name);
        } catch (error) {
            throw new Error(`Failed to read rule categories: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async getTemplatesInCategory(category: string): Promise<RuleTemplate[]> {
        try {
            const categoryPath = path.join(this.rulesPath, category);
            const content = await fs.promises.readFile(path.join(categoryPath, '.cursorrules'), 'utf-8');
            
            return [{
                id: category,
                name: category,
                category,
                description: content.split('\n')[0].trim(),
                content
            }];
        } catch (error) {
            throw new Error(`Failed to read templates in category ${category}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async createTemplatePreview(template: RuleTemplate): Promise<void> {
        const document = await vscode.workspace.openTextDocument({
            content: template.content,
            language: 'markdown'
        });
        await vscode.window.showTextDocument(document, { preview: true });
    }

    private convertTemplateContent(content: string): string {
        return content;
    }

    public async saveTemplateToWorkspace(template: RuleTemplate, targetUri?: vscode.Uri): Promise<void> {
        try {
            // If no target URI provided, get the workspace folder
            if (!targetUri) {
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders) {
                    throw new Error('No workspace folder found');
                }
                targetUri = vscode.Uri.joinPath(workspaceFolders[0].uri, '.cursorrules');
            }

            // Convert template content to proper format
            const convertedContent = this.convertTemplateContent(template.content);

            // Check if file exists
            try {
                await vscode.workspace.fs.stat(targetUri);
                // File exists, ask for confirmation
                const choice = await vscode.window.showWarningMessage(
                    'A .cursorrules file already exists. Do you want to replace it?',
                    'Replace',
                    'Cancel'
                );
                
                if (choice !== 'Replace') {
                    return;
                }

                // Create backup with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupUri = vscode.Uri.joinPath(
                    targetUri.with({ path: path.dirname(targetUri.fsPath) }), 
                    `.cursorrules.${timestamp}.backup`
                );
                await vscode.workspace.fs.copy(targetUri, backupUri, { overwrite: true });
            } catch (e) {
                // File doesn't exist, continue with creation
            }

            // Write the converted template content
            await vscode.workspace.fs.writeFile(targetUri, Buffer.from(convertedContent, 'utf-8'));
            
            // Show success message with backup info
            void vscode.window.showInformationMessage('Template saved successfully');
            
            // Open the file
            const document = await vscode.workspace.openTextDocument(targetUri);
            await vscode.window.showTextDocument(document);
        } catch (error) {
            throw new Error(`Failed to save template: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
} 
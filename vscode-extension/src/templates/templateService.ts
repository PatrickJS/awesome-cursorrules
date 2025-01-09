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
} 
import * as vscode from 'vscode';
import { CursorRules, RuleValidation } from '../types/cursorrules';
import schema from '../schemas/cursorrules.schema.json';
import type { default as AjvType, ValidateFunction } from 'ajv';

interface PreviewResult {
    original: string;
    converted: string;
    diff: Array<{
        lineNumber: number;
        type: 'added' | 'removed' | 'modified';
        content: string;
    }>;
}

export class TextConverter {
    private static previewDocument: vscode.TextDocument | undefined;
    private static validator: AjvType | undefined;
    private static temporaryFiles: Set<vscode.Uri> = new Set();

    private static getValidator(): AjvType {
        if (!this.validator) {
            // Dynamic import to avoid TypeScript issues with Ajv
            // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
            const ajvModule: { default: typeof AjvType } = require('ajv');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const ajvInstance = new ajvModule.default({ allErrors: true });
            // Initialize validator with schema
            this.validator = ajvInstance;
            this.validator.addSchema(schema as unknown as object, 'cursorrules');
        }
        if (!this.validator) {
            throw new Error('Failed to initialize validator');
        }
        return this.validator;
    }

    /**
     * Validates a CursorRules object against the JSON schema
     * @param rules The rules object to validate
     * @returns Validation result with any errors
     */
    private static validateRules(rules: CursorRules): RuleValidation {
        const validator = this.getValidator();
        const validate = validator.getSchema('cursorrules') as ValidateFunction<CursorRules>;
        if (!validate) {
            throw new Error('Schema validation failed: Schema not found');
        }

        const isValid = validate(rules);
        return {
            isValid: isValid,
            errors: isValid ? undefined : 
                validate.errors?.map(error => 
                    `${error.schemaPath} ${error.message || 'Unknown error'}`
                )
        };
    }

    /**
     * Creates a preview of the conversion showing original and converted content
     * @param uri The URI of the file to preview
     * @returns Preview result with original content, converted content, and diff
     */
    public static async previewConversion(uri: vscode.Uri): Promise<PreviewResult> {
        // Read the original content
        const content = await vscode.workspace.fs.readFile(uri);
        const originalContent = Buffer.from(content).toString('utf-8');

        try {
            // Convert to JSON
            const jsonContent = await this.convertToJson(originalContent);
            const convertedContent = JSON.stringify(jsonContent, null, 4);

            // Create diff
            const originalLines = originalContent.split('\n');
            const convertedLines = convertedContent.split('\n');
            const diff: PreviewResult['diff'] = [];

            // Simple diff algorithm
            let i = 0;
            while (i < Math.max(originalLines.length, convertedLines.length)) {
                if (i >= originalLines.length) {
                    diff.push({
                        lineNumber: i + 1,
                        type: 'added',
                        content: convertedLines[i]
                    });
                } else if (i >= convertedLines.length) {
                    diff.push({
                        lineNumber: i + 1,
                        type: 'removed',
                        content: originalLines[i]
                    });
                } else if (originalLines[i] !== convertedLines[i]) {
                    diff.push({
                        lineNumber: i + 1,
                        type: 'modified',
                        content: `${originalLines[i]} → ${convertedLines[i]}`
                    });
                }
                i++;
            }

            return {
                original: originalContent,
                converted: convertedContent,
                diff
            };
        } catch (error) {
            throw new Error(`Failed to create preview: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Shows a preview of the conversion in a new editor
     * @param uri The URI of the file to preview
     * @returns Promise that resolves when the preview is ready
     */
    public static async showPreview(uri: vscode.Uri): Promise<void> {
        try {
            const preview = await this.previewConversion(uri);
            
            // Create preview document
            const previewContent = [
                '# Conversion Preview',
                '',
                '## Original Content',
                '```',
                preview.original,
                '```',
                '',
                '## Converted Content (Editable)',
                '```json',
                preview.converted,
                '```',
                '',
                '## Changes',
                ...preview.diff.map(d => `${d.lineNumber}: ${d.type} - ${d.content}`),
                '',
                '## Instructions',
                '1. Review the converted content above',
                '2. Edit the JSON in the "Converted Content" section if needed',
                '3. Save this file to update the preview',
                '4. Close this preview to cancel the conversion'
            ].join('\n');

            // Create a temporary file for the preview
            const tempUri = uri.with({ path: `${uri.path}.preview.md` });
            await vscode.workspace.fs.writeFile(tempUri, Buffer.from(previewContent, 'utf-8'));
            this.temporaryFiles.add(tempUri);
            
            // Show preview in new editor
            const doc = await vscode.workspace.openTextDocument(tempUri);
            this.previewDocument = doc;

            await vscode.window.showTextDocument(doc, {
                preview: true,
                viewColumn: vscode.ViewColumn.Beside
            });

            // Ask for confirmation after preview
            const choice = await vscode.window.showWarningMessage(
                'Review the preview and make any needed edits. Would you like to proceed with the conversion?',
                'Convert',
                'Cancel'
            );

            if (choice !== 'Convert') {
                this.previewDocument = undefined;
                await this.cleanupTemporaryFiles();
                return;
            }

            // Register preview document close handler
            const closeHandler = vscode.workspace.onDidCloseTextDocument(async closedDoc => {
                if (closedDoc === doc) {
                    this.previewDocument = undefined;
                    await this.cleanupTemporaryFiles();
                    closeHandler.dispose();
                }
            });
        } catch (error) {
            this.previewDocument = undefined;
            await this.cleanupTemporaryFiles();
            throw new Error(`Failed to show preview: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Gets the edited content from the preview document
     * @returns The edited JSON content, or undefined if preview is not active
     */
    public static getEditedPreview(): string | undefined {
        if (!this.previewDocument) {
            return undefined;
        }

        const content = this.previewDocument.getText();
        const match = content.match(/## Converted Content \(Editable\)\n```json\n([\s\S]*?)\n```/);
        return match ? match[1].trim() : undefined;
    }

    /**
     * Checks if there's an active preview
     * @returns True if there's an active preview
     */
    public static hasActivePreview(): boolean {
        return this.previewDocument !== undefined;
    }

    /**
     * Converts markdown-formatted .cursorrules content to JSON format
     * @param content The markdown content to convert
     * @returns The converted JSON content as a CursorRules object
     */
    public static convertToJson(content: string): Promise<CursorRules> {
        return new Promise((resolve) => {
            // First try to parse as JSON
            try {
                const jsonContent = JSON.parse(content) as CursorRules;
                // Validate the parsed JSON
                const validation = this.validateRules(jsonContent);
                if (validation.isValid) {
                    // If it's already valid JSON, return it as is
                    return resolve(jsonContent);
                }
            } catch (e) {
                // Not valid JSON, continue with conversion
            }

            // Create a simple rule object from the content
            const rules: CursorRules = {
                version: '1.0.0',
                languages: {
                    default: {
                        rules: [{
                            id: 'rule-1',
                            level: 'error',
                            description: content.trim()
                        }]
                    }
                }
            };

            resolve(rules);
        });
    }

    /**
     * Converts markdown content to JSON and writes it to a file
     * @param uri The URI of the markdown file to convert
     * @returns The URI of the created JSON file
     */
    public static async convertFile(uri: vscode.Uri): Promise<vscode.Uri> {
        try {
            // Check for edited preview content
            const editedContent = this.getEditedPreview();
            if (editedContent) {
                try {
                    // Validate edited content
                    const editedJson = JSON.parse(editedContent) as CursorRules;
                    const validation = this.validateRules(editedJson);
                    if (!validation.isValid) {
                        throw new Error(`Invalid edited JSON: ${validation.errors?.join(', ')}`);
                    }

                    // Create backup with timestamp
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const backupUri = uri.with({ path: `${uri.path}.${timestamp}.backup` });
                    await vscode.workspace.fs.copy(uri, backupUri, { overwrite: false });
                    
                    // Move backup to dedicated directory
                    await this.moveToBackupDirectory(backupUri);

                    // Write the edited content
                    await vscode.workspace.fs.writeFile(uri, Buffer.from(editedContent, 'utf-8'));
                    return uri;
                } catch (error) {
                    throw new Error(`Invalid JSON in preview: ${error instanceof Error ? error.message : String(error)}`);
                } finally {
                    await this.cleanupTemporaryFiles();
                }
            }

            // If no edited content, proceed with normal conversion
            const content = await vscode.workspace.fs.readFile(uri);
            const textContent = Buffer.from(content).toString('utf-8');
            const jsonContent = await this.convertToJson(textContent);
            const jsonString = JSON.stringify(jsonContent, null, 4);

            // Create backup with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupUri = uri.with({ path: `${uri.path}.${timestamp}.backup` });
            await vscode.workspace.fs.copy(uri, backupUri, { overwrite: false });
            
            // Move backup to dedicated directory
            await this.moveToBackupDirectory(backupUri);

            // Write the JSON content
            await vscode.workspace.fs.writeFile(uri, Buffer.from(jsonString, 'utf-8'));
            return uri;
        } catch (error) {
            throw new Error(`Failed to convert file: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            // Clear preview state and cleanup
            this.previewDocument = undefined;
            await this.cleanupTemporaryFiles();
        }
    }

    private static async cleanupTemporaryFiles(): Promise<void> {
        for (const uri of this.temporaryFiles) {
            try {
                await vscode.workspace.fs.delete(uri);
                // Close any editors showing the deleted file
                const editorsWithDeletedFile = vscode.window.visibleTextEditors.filter(
                    editor => editor.document.uri.fsPath === uri.fsPath
                );
                for (const editor of editorsWithDeletedFile) {
                    await vscode.window.showTextDocument(editor.document);
                    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
                }
            } catch (error) {
                console.error(`Failed to delete temporary file ${uri.fsPath}:`, error);
            }
        }
        this.temporaryFiles.clear();
    }

    private static async ensureBackupDirectory(workspaceUri: vscode.Uri): Promise<vscode.Uri> {
        const backupDirUri = vscode.Uri.joinPath(workspaceUri, '.cursorrules-backup');
        try {
            await vscode.workspace.fs.stat(backupDirUri);
        } catch {
            // Directory doesn't exist, create it
            await vscode.workspace.fs.createDirectory(backupDirUri);
        }
        return backupDirUri;
    }

    private static async moveToBackupDirectory(backupUri: vscode.Uri): Promise<void> {
        try {
            // Get workspace root
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder found');
            }

            // Ensure backup directory exists
            const backupDirUri = await this.ensureBackupDirectory(workspaceFolder.uri);
            
            // Create new URI in backup directory
            const fileName = backupUri.path.split('/').pop();
            if (!fileName) {
                throw new Error('Invalid backup file path');
            }
            const newBackupUri = vscode.Uri.joinPath(backupDirUri, fileName);

            // Move the file
            await vscode.workspace.fs.copy(backupUri, newBackupUri, { overwrite: false });
            await vscode.workspace.fs.delete(backupUri);
        } catch (error) {
            console.error(`Failed to move backup file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
} 
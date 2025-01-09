import * as vscode from 'vscode';
import { CursorRules, Rule, RuleValidation } from '../types/cursorrules';
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

export class MarkdownConverter {
    private static previewDocument: vscode.TextDocument | undefined;
    private static validator: AjvType | undefined;

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
                '```markdown',
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

            // Show preview in new editor
            const doc = await vscode.workspace.openTextDocument({
                content: previewContent,
                language: 'markdown'
            });
            
            this.previewDocument = doc;

            await vscode.window.showTextDocument(doc, {
                preview: true,
                viewColumn: vscode.ViewColumn.Beside
            });

            // Register preview document close handler
            const closeHandler = vscode.workspace.onDidCloseTextDocument(closedDoc => {
                if (closedDoc === doc) {
                    this.previewDocument = undefined;
                    closeHandler.dispose();
                }
            });
        } catch (error) {
            this.previewDocument = undefined;
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
            const lines = content.split('\n');
            const rules: CursorRules = {
                version: '1.0.0',
                languages: {}
            };

            let currentLanguage: string | null = null;

            for (const line of lines) {
                const trimmedLine = line.trim();
                
                // Skip empty lines
                if (!trimmedLine) {
                    continue;
                }

                // Check for language header (# Language)
                const headerMatch = trimmedLine.match(/^#\s+(\w+)\s*(?:Rules)?$/i);
                if (headerMatch) {
                    currentLanguage = headerMatch[1].toLowerCase();
                    if (!rules.languages[currentLanguage]) {
                        rules.languages[currentLanguage] = { rules: [] };
                    }
                    continue;
                }

                // Check for rule definition (- rule-id: description)
                if (currentLanguage && trimmedLine.startsWith('-')) {
                    const ruleMatch = trimmedLine.match(/^-\s*([^:]+):\s*(.+)$/);
                    if (ruleMatch) {
                        const [, id, description] = ruleMatch;
                        const rule: Rule = {
                            id: id.trim(),
                            level: 'error', // Default level
                            description: description.trim()
                        };
                        rules.languages[currentLanguage].rules.push(rule);
                    }
                }
            }

            // Validate the converted content
            if (Object.keys(rules.languages).length === 0) {
                throw new Error('No valid rules found in the markdown content');
            }

            // Validate against schema
            const validation = this.validateRules(rules);
            if (!validation.isValid) {
                throw new Error(`Invalid rules format: ${validation.errors?.join(', ')}`);
            }

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

                    // Create backup of original file
                    const backupUri = uri.with({ path: `${uri.path}.backup` });
                    await vscode.workspace.fs.copy(uri, backupUri, { overwrite: false });

                    // Write the edited content
                    await vscode.workspace.fs.writeFile(uri, Buffer.from(editedContent, 'utf-8'));
                    return uri;
                } catch (error) {
                    throw new Error(`Invalid JSON in preview: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            // If no edited content, proceed with normal conversion
            const content = await vscode.workspace.fs.readFile(uri);
            const markdownContent = Buffer.from(content).toString('utf-8');
            const jsonContent = await this.convertToJson(markdownContent);
            const jsonString = JSON.stringify(jsonContent, null, 4);

            // Create backup of original file
            const backupUri = uri.with({ path: `${uri.path}.backup` });
            await vscode.workspace.fs.copy(uri, backupUri, { overwrite: false });

            // Write the JSON content
            await vscode.workspace.fs.writeFile(uri, Buffer.from(jsonString, 'utf-8'));
            return uri;
        } catch (error) {
            throw new Error(`Failed to convert file: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            // Clear preview state
            this.previewDocument = undefined;
        }
    }
} 
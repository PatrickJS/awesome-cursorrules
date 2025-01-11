import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TextConverter } from '../../converter/textConverter';
import { CursorRules } from '../../types/cursorrules';

suite('TextConverter Test Suite', () => {
    let testFilePath: string;
    let testFileUri: vscode.Uri;

    setup(async () => {
        // Create a test file
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        assert.ok(workspaceFolder, 'No workspace folder found');
        
        testFilePath = path.join(workspaceFolder.uri.fsPath, '.cursorrules.test');
        testFileUri = vscode.Uri.file(testFilePath);
        
        const testContent = 'Test content for conversion';
        await fs.promises.writeFile(testFilePath, testContent);
    });

    teardown(async () => {
        // Clean up test files
        try {
            await fs.promises.unlink(testFilePath);
            await fs.promises.unlink(testFilePath + '.backup');
        } catch (e) {
            // Ignore errors if files don't exist
        }
    });

    test('should convert text to JSON format', async () => {
        // Mock the warning message dialog
        const mockShowWarningMessage = vscode.window.showWarningMessage;
        vscode.window.showWarningMessage = function(): Promise<string> { return Promise.resolve('Convert'); };

        try {
            // Show preview
            await TextConverter.showPreview(testFileUri);
            
            // Get the preview document
            const previewDoc = vscode.workspace.textDocuments.find(doc => 
                doc.fileName.endsWith('.preview.md')
            );
            assert.ok(previewDoc, 'Preview document should be created');
            
            // Convert file
            await TextConverter.convertFile(testFileUri);
            
            // Verify the converted content
            const content = await fs.promises.readFile(testFilePath, 'utf-8');
            const json = JSON.parse(content) as CursorRules;
            assert.ok(json.languages.default, 'Should have default rules');
            assert.strictEqual(json.languages.default.rules.length, 1, 'Should have one rule');
        } finally {
            vscode.window.showWarningMessage = mockShowWarningMessage;
        }
    });

    test('should handle any text content', async () => {
        const content = 'Any text content is valid';
        const result = await TextConverter.convertToJson(content);
        assert.ok(result.languages.default, 'Should have default rules');
        assert.strictEqual(result.languages.default.rules[0].description, content, 'Should preserve content');
    });
}); 
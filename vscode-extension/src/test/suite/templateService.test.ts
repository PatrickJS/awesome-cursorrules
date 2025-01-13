import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { TemplateService } from '../../templates/templateService';

suite('TemplateService Test Suite', () => {
    let templateService: TemplateService;
    let testWorkspacePath: string;
    const mockTemplate = {
        id: 'test-template',
        name: 'Test Template',
        category: 'test',
        description: 'Test description',
        content: 'Test content\nLine 2\nLine 3'
    };

    setup(function(): void {
        templateService = new TemplateService('test-path');
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        assert.ok(workspaceFolder, 'No workspace folder found');
        testWorkspacePath = workspaceFolder.uri.fsPath;
    });

    teardown(async function(): Promise<void> {
        try {
            await fs.promises.unlink(path.join(testWorkspacePath, '.cursorrules'));
            
            // Clean up files in original directory
            const files = await fs.promises.readdir(testWorkspacePath);
            for (const file of files) {
                if (file.startsWith('.cursorrules.') && file.endsWith('.backup')) {
                    await fs.promises.unlink(path.join(testWorkspacePath, file));
                }
            }

            // Clean up files in backup directory
            const backupDirPath = path.join(testWorkspacePath, '.cursorrules-backup');
            try {
                const backupFiles = await fs.promises.readdir(backupDirPath);
                for (const file of backupFiles) {
                    if (file.startsWith('.cursorrules.') && file.endsWith('.backup')) {
                        await fs.promises.unlink(path.join(backupDirPath, file));
                    }
                }
                // Remove backup directory if empty
                await fs.promises.rmdir(backupDirPath);
            } catch (e) {
                // Ignore errors if backup directory doesn't exist
            }
        } catch (e) {
            // Ignore errors if files don't exist
        }
    });

    test('should save template content correctly', async () => {
        const targetUri = vscode.Uri.file(path.join(testWorkspacePath, '.cursorrules'));
        await templateService.saveTemplateToWorkspace(mockTemplate, targetUri);

        const content = await fs.promises.readFile(targetUri.fsPath, 'utf-8');
        assert.ok(content.includes('Test content'), 'Should contain first line');
        assert.ok(content.includes('Line 2'), 'Should contain second line');
        assert.ok(content.includes('Line 3'), 'Should contain third line');
    });

    test('should handle existing file replacement', async () => {
        const targetUri = vscode.Uri.file(path.join(testWorkspacePath, '.cursorrules'));
        const originalContent = 'Original content';
        await fs.promises.writeFile(targetUri.fsPath, originalContent);

        const mockShowWarningMessage = vscode.window.showWarningMessage;
        vscode.window.showWarningMessage = function(): Promise<string> { return Promise.resolve('Replace'); };

        try {
            await templateService.saveTemplateToWorkspace(mockTemplate, targetUri);

            // Verify backup was created (check both original and backup directory)
            const backupFiles = await fs.promises.readdir(path.dirname(targetUri.fsPath));
            const backupDirPath = path.join(path.dirname(targetUri.fsPath), '.cursorrules-backup');
            let backupDirFiles: string[] = [];
            try {
                backupDirFiles = await fs.promises.readdir(backupDirPath);
            } catch (e) {
                // Backup directory might not exist yet
            }
            const backupExists = backupFiles.some(file => file.startsWith('.cursorrules.') && file.endsWith('.backup')) ||
                               backupDirFiles.some(file => file.startsWith('.cursorrules.') && file.endsWith('.backup'));
            assert.ok(backupExists, 'Backup file should be created');

            // Verify new content
            const content = await fs.promises.readFile(targetUri.fsPath, 'utf-8');
            assert.ok(content.includes('Test content'), 'Should contain template content');
        } finally {
            vscode.window.showWarningMessage = mockShowWarningMessage;
        }
    });

    test('should cancel file replacement when user declines', async () => {
        const targetUri = vscode.Uri.file(path.join(testWorkspacePath, '.cursorrules'));
        const originalContent = 'Original content';
        await fs.promises.writeFile(targetUri.fsPath, originalContent);

        const mockShowWarningMessage = vscode.window.showWarningMessage;
        vscode.window.showWarningMessage = function(): Promise<string> { return Promise.resolve('Cancel'); };

        try {
            await templateService.saveTemplateToWorkspace(mockTemplate, targetUri);

            // Verify original content remains
            const content = await fs.promises.readFile(targetUri.fsPath, 'utf-8');
            assert.strictEqual(content, originalContent, 'File should retain original content');

            // Verify no backup was created
            const backupFiles = await fs.promises.readdir(path.dirname(targetUri.fsPath));
            const backupExists = backupFiles.some(file => file.startsWith('.cursorrules.') && file.endsWith('.backup'));
            assert.ok(!backupExists, 'No backup file should be created when cancelled');
        } finally {
            vscode.window.showWarningMessage = mockShowWarningMessage;
        }
    });
});
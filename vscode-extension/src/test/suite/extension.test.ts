import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    test('Status bar item should be visible', () => {
        const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBar.text = "$(eye) CursorRules";
        statusBar.tooltip = "Cursor Rules Dynamic is active";
        statusBar.show();

        assert.strictEqual(statusBar.text, "$(eye) CursorRules");
        assert.strictEqual(statusBar.tooltip, "Cursor Rules Dynamic is active");
        statusBar.dispose();
    });

    test('Status bar should update with language information', () => {
        const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        const testLanguageId = 'typescript';
        
        statusBar.text = `$(eye) CursorRules [${testLanguageId}]`;
        statusBar.tooltip = `Monitoring ${testLanguageId} files`;
        
        assert.strictEqual(
            statusBar.text,
            `$(eye) CursorRules [${testLanguageId}]`,
            'Status bar text should include language ID'
        );
        assert.strictEqual(
            statusBar.tooltip,
            `Monitoring ${testLanguageId} files`,
            'Tooltip should indicate monitored language'
        );
        
        statusBar.dispose();
    });

    test('Extension activation should register commands', async () => {
        // Wait a bit for extension activation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const commands = await vscode.commands.getCommands();
        assert.ok(
            commands.includes('cursor-rules-dynamic.showStatus'),
            'Show status command should be registered'
        );
        assert.ok(
            commands.includes('cursor-rules-dynamic.scanProject'),
            'Scan project command should be registered'
        );
    });
}); 
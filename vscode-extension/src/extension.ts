import * as vscode from 'vscode';

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

    // Register commands
    const disposable = vscode.commands.registerCommand('cursor-rules-dynamic.showStatus', () => {
        const editor = vscode.window.activeTextEditor;
        const languageId = editor?.document.languageId || 'none';
        const message = `Cursor Rules Dynamic is active and monitoring ${languageId} files`;
        void vscode.window.showInformationMessage(message);
    });

    context.subscriptions.push(watcher);
    context.subscriptions.push(disposable);

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
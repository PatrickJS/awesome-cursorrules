import * as vscode from 'vscode';
import * as path from 'path';

export type Language = 'python' | 'typescript' | 'javascript' | 'unknown';

export class LanguageDetector {
    private readonly extensionMap: Record<string, Language> = {
        ['.py']: 'python',
        ['.ts']: 'typescript',
        ['.js']: 'javascript'
    };

    public detectLanguage(uri: vscode.Uri): Language {
        const extension = path.extname(uri.fsPath).toLowerCase();
        return this.extensionMap[extension] || 'unknown';
    }

    public supportsLanguage(language: Language): boolean {
        return language !== 'unknown' && Object.values(this.extensionMap).includes(language);
    }
} 
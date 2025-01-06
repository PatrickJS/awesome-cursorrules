import * as assert from 'assert';
import * as vscode from 'vscode';
import { LanguageDetector } from '../../languageDetector';

suite('LanguageDetector Test Suite', () => {
    let detector: LanguageDetector;

    setup(() => {
        detector = new LanguageDetector();
    });

    suite('detectLanguage', () => {
        test('should identify Python files', () => {
            const uri = vscode.Uri.file('/path/to/test.py');
            assert.strictEqual(detector.detectLanguage(uri), 'python');
        });

        test('should identify TypeScript files', () => {
            const uri = vscode.Uri.file('/path/to/test.ts');
            assert.strictEqual(detector.detectLanguage(uri), 'typescript');
        });

        test('should identify JavaScript files', () => {
            const uri = vscode.Uri.file('/path/to/test.js');
            assert.strictEqual(detector.detectLanguage(uri), 'javascript');
        });

        test('should handle files with no extension', () => {
            const uri = vscode.Uri.file('/path/to/noextension');
            assert.strictEqual(detector.detectLanguage(uri), 'unknown');
        });

        test('should handle files with empty extension', () => {
            const uri = vscode.Uri.file('/path/to/test.');
            assert.strictEqual(detector.detectLanguage(uri), 'unknown');
        });

        test('should return unknown for unsupported extensions', () => {
            const uri = vscode.Uri.file('/path/to/test.xyz');
            assert.strictEqual(detector.detectLanguage(uri), 'unknown');
        });

        test('should handle case-insensitive extensions', () => {
            const uri = vscode.Uri.file('/path/to/test.PY');
            assert.strictEqual(detector.detectLanguage(uri), 'python');
        });
    });

    suite('supportsLanguage', () => {
        test('should return true for supported languages', () => {
            assert.strictEqual(detector.supportsLanguage('python'), true);
            assert.strictEqual(detector.supportsLanguage('typescript'), true);
            assert.strictEqual(detector.supportsLanguage('javascript'), true);
        });

        test('should return false for unknown language', () => {
            assert.strictEqual(detector.supportsLanguage('unknown'), false);
        });

        test('should handle all language types correctly', () => {
            const allLanguages: Array<'python' | 'typescript' | 'javascript' | 'unknown'> = [
                'python', 'typescript', 'javascript', 'unknown'
            ];
            
            allLanguages.forEach(lang => {
                const result = detector.supportsLanguage(lang);
                if (lang === 'unknown') {
                    assert.strictEqual(result, false, `Expected 'unknown' to return false`);
                } else {
                    assert.strictEqual(result, true, `Expected '${lang}' to return true`);
                }
            });
        });
    });
}); 
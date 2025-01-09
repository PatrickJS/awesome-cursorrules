import * as assert from 'assert';
import { MarkdownConverter } from '../../converter/markdownConverter';

suite('MarkdownConverter Test Suite', () => {
    let markdown: string;

    setup(function(): void {
        markdown = '';
    });

    suite('Basic Conversion Tests', () => {
        test('should convert basic markdown to JSON', async function(): Promise<void> {
            markdown = `
# TypeScript Rules
- no-any: Avoid using the 'any' type
- strict-null-checks: Enable strict null checks

# Python Rules
- type-hints: Use type hints for function parameters
- f-strings: Use f-strings for string formatting
`;
            const result = await MarkdownConverter.convertToJson(markdown);

            assert.strictEqual(result.version, '1.0.0');
            assert.ok(result.languages.typescript);
            assert.ok(result.languages.python);
            
            const tsRules = result.languages.typescript.rules;
            assert.strictEqual(tsRules.length, 2);
            assert.strictEqual(tsRules[0].id, 'no-any');
            assert.strictEqual(tsRules[0].description, "Avoid using the 'any' type");
            assert.strictEqual(tsRules[0].level, 'error');

            const pyRules = result.languages.python.rules;
            assert.strictEqual(pyRules.length, 2);
            assert.strictEqual(pyRules[0].id, 'type-hints');
            assert.strictEqual(pyRules[0].description, 'Use type hints for function parameters');
            assert.strictEqual(pyRules[0].level, 'error');
        });

        test('should handle empty input', async function(): Promise<void> {
            await assert.rejects(
                async () => await MarkdownConverter.convertToJson(''),
                /No valid rules found/
            );
        });

        test('should handle malformed input', async function(): Promise<void> {
            const result = await MarkdownConverter.convertToJson(`
Invalid content
- not under a language
# TypeScript
Invalid rule format
`);
            assert.strictEqual(Object.keys(result.languages).length, 1);
            assert.strictEqual(result.languages.typescript.rules.length, 0);
        });

        test('should normalize language names', async function(): Promise<void> {
            const result = await MarkdownConverter.convertToJson(`
# TYPESCRIPT Rules
- rule-1: Test rule
# Python RULES
- rule-2: Another test
`);
            assert.ok(result.languages.typescript);
            assert.ok(result.languages.python);
        });
    });
}); 
import * as path from 'path';
import * as fs from 'fs';
import { runTests } from '@vscode/test-electron';

async function cleanupTestDirectory(testWorkspace: string) {
    try {
        // Clean up test workspace
        if (fs.existsSync(testWorkspace)) {
            fs.rmSync(testWorkspace, { recursive: true, force: true });
        }
        fs.mkdirSync(testWorkspace, { recursive: true });

        // Clean up VSCode test instance data
        const userDataDir = path.join(__dirname, '../../../.vscode-test/user-data');
        if (fs.existsSync(userDataDir)) {
            fs.rmSync(userDataDir, { recursive: true, force: true });
        }
    } catch (err) {
        console.warn('Cleanup warning:', err);
    }
}

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
        const extensionTestsPath = path.resolve(__dirname, '../suite/index');
        const testWorkspace = path.resolve(extensionDevelopmentPath, '.vscode-test/workspace');

        // Clean up before tests
        await cleanupTestDirectory(testWorkspace);

        // Run the tests
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                testWorkspace,
                '--disable-extensions',
                '--disable-telemetry',
                '--user-data-dir=' + path.join(extensionDevelopmentPath, '.vscode-test/user-data')
            ]
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main(); 
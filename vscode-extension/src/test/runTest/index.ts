/// <reference types="node" />
import * as path from 'path';
import * as fs from 'fs';
import { runTests } from '@vscode/test-electron';
import * as os from 'os';

async function cleanupTestDirectory(testWorkspace: string): Promise<void> {
    try {
        // Clean up test workspace
        if (fs.existsSync(testWorkspace)) {
            await fs.promises.rm(testWorkspace, { recursive: true, force: true });
        }
        await fs.promises.mkdir(testWorkspace, { recursive: true });

        // Clean up VSCode test instance data using a shorter path
        const userDataDir = path.join(os.tmpdir(), 'vscode-test-userdata');
        if (fs.existsSync(userDataDir)) {
            await fs.promises.rm(userDataDir, { recursive: true, force: true });
        }
    } catch (err) {
        console.warn('Cleanup warning:', err);
    }
}

async function main(): Promise<void> {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
        const extensionTestsPath = path.resolve(__dirname, '../suite/index');
        const testWorkspace = path.resolve(extensionDevelopmentPath, '.vscode-test/workspace');

        // Clean up before tests
        await cleanupTestDirectory(testWorkspace);
        
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                testWorkspace,
                '--disable-extensions',
                '--disable-telemetry',
                '--user-data-dir=' + path.join(os.tmpdir(), 'vscode-test-userdata'),
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--force-device-scale-factor=1'
            ]
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

void main(); 
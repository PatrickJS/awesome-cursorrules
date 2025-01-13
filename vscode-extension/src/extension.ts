import * as vscode from 'vscode';
import { TextConverter } from './converter/textConverter';
import { TemplateService } from './templates/templateService';
import { CursorRules } from './types/cursorrules';

interface ProjectAnalysis {
    codePatterns: {
        naming: {
            variables: string[];
            functions: string[];
            classes: string[];
        };
        structure: {
            directories: string[];
            fileTypes: string[];
        };
        conventions: {
            formatting: string[];
            documentation: string[];
            testing: string[];
        };
    };
    timestamp: string;
}

// Project analysis functions
async function analyzeProject(): Promise<ProjectAnalysis> {
    function analyzeNamingConventions(content: string, analysis: ProjectAnalysis): void {
        // Function names (basic detection)
        const functionMatches = content.match(/function\s+([a-zA-Z][a-zA-Z0-9]*)/g);
        if (functionMatches) {
            functionMatches.forEach(match => {
                const name = match.replace('function ', '');
                if (!analysis.codePatterns.naming.functions.includes(name)) {
                    analysis.codePatterns.naming.functions.push(name);
                }
            });
        }

        // Class names
        const classMatches = content.match(/class\s+([a-zA-Z][a-zA-Z0-9]*)/g);
        if (classMatches) {
            classMatches.forEach(match => {
                const name = match.replace('class ', '');
                if (!analysis.codePatterns.naming.classes.includes(name)) {
                    analysis.codePatterns.naming.classes.push(name);
                }
            });
        }
    }

    function analyzeConventions(content: string, analysis: ProjectAnalysis): void {
        // Documentation conventions
        if (content.includes('/**')) {
            if (!analysis.codePatterns.conventions.documentation.includes('JSDoc')) {
                analysis.codePatterns.conventions.documentation.push('JSDoc');
            }
        }
        
        // Test conventions
        if (content.includes('describe(') || content.includes('test(') || content.includes('it(')) {
            if (!analysis.codePatterns.conventions.testing.includes('UnitTests')) {
                analysis.codePatterns.conventions.testing.push('UnitTests');
            }
        }
    }

    const workspaceFiles = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
    const analysis: ProjectAnalysis = {
        codePatterns: {
            naming: { variables: [], functions: [], classes: [] },
            structure: { directories: [], fileTypes: [] },
            conventions: { formatting: [], documentation: [], testing: [] }
        },
        timestamp: new Date().toISOString()
    };

    for (const file of workspaceFiles) {
        try {
            // Analyze file structure
            const relativePath = vscode.workspace.asRelativePath(file);
            const pathParts = relativePath.split('/');
            const fileType = file.fsPath.split('.').pop() || '';

            // Track directories and file types
            pathParts.forEach(part => {
                if (!part.includes('.') && !analysis.codePatterns.structure.directories.includes(part)) {
                    analysis.codePatterns.structure.directories.push(part);
                }
            });
            if (!analysis.codePatterns.structure.fileTypes.includes(fileType)) {
                analysis.codePatterns.structure.fileTypes.push(fileType);
            }

            // For code files, analyze content
            if (['ts', 'js', 'py'].includes(fileType)) {
                const content = await vscode.workspace.fs.readFile(file);
                const text = Buffer.from(content).toString('utf-8');
                
                // Analyze naming conventions
                analyzeNamingConventions(text, analysis);
                
                // Analyze documentation and formatting
                analyzeConventions(text, analysis);
            }
        } catch (error) {
            console.warn(`Error analyzing file ${file.fsPath}:`, error);
        }
    }

    return analysis;
}

function compareWithCurrentRules(analysisResults: ProjectAnalysis, currentRules: CursorRules): boolean {
    function extractStructureFromRules(rules: CursorRules): ProjectAnalysis['codePatterns']['structure'] {
        const structure: ProjectAnalysis['codePatterns']['structure'] = {
            directories: [],
            fileTypes: []
        };

        // Extract from rules description
        if (rules.languages?.default?.rules?.[0]?.description) {
            const desc = rules.languages.default.rules[0].description;
            
            // Extract directories from Project Structure section
            const structureMatch = desc.match(/Project Structure([\s\S]*?)(?=\/\/|$)/);
            if (structureMatch) {
                const dirs = structureMatch[1].match(/[a-zA-Z]+\//g);
                if (dirs) {
                    structure.directories = dirs.map(d => d.replace('/', ''));
                }
            }

            // Extract file types
            const fileTypeMatches = desc.match(/\.[a-z]+/g);
            if (fileTypeMatches) {
                structure.fileTypes = [...new Set(fileTypeMatches.map(f => f.replace('.', '')))];
            }
        }

        return structure;
    }

    function extractConventionsFromRules(rules: CursorRules): ProjectAnalysis['codePatterns']['conventions'] {
        const conventions: ProjectAnalysis['codePatterns']['conventions'] = {
            formatting: [],
            documentation: [],
            testing: []
        };

        if (rules.languages?.default?.rules?.[0]?.description) {
            const desc = rules.languages.default.rules[0].description;

            // Extract documentation conventions
            if (desc.includes('TSDoc')) {
                conventions.documentation.push('TSDoc');
            }
            if (desc.includes('JSDoc')) {
                conventions.documentation.push('JSDoc');
            }

            // Extract testing conventions
            if (desc.includes('Mocha')) {
                conventions.testing.push('UnitTests');
            }

            // Extract formatting conventions
            if (desc.includes('Prettier')) {
                conventions.formatting.push('Prettier');
            }
            if (desc.includes('ESLint')) {
                conventions.formatting.push('ESLint');
            }
        }

        return conventions;
    }

    // Check if current rules reflect the analyzed patterns
    let hasSignificantChanges = false;

    // Compare project structure
    const currentStructure = extractStructureFromRules(currentRules);
    const newStructure = analysisResults.codePatterns.structure;

    // Check for new directories or file types
    const structureChanges = newStructure.directories.some(dir => 
        !currentStructure.directories.includes(dir)) ||
        newStructure.fileTypes.some(type => 
            !currentStructure.fileTypes.includes(type));

    // Compare conventions
    const currentConventions = extractConventionsFromRules(currentRules);
    const newConventions = analysisResults.codePatterns.conventions;

    const conventionChanges = Object.keys(newConventions).some(key => 
        newConventions[key as keyof typeof newConventions].some(conv => 
            !currentConventions[key as keyof typeof currentConventions]?.includes(conv)
        )
    );

    hasSignificantChanges = structureChanges || conventionChanges;

    return hasSignificantChanges;
}

export function activate(context: vscode.ExtensionContext): void {
    console.log('Cursor Rules Dynamic extension is now active');

    // Create status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = "$(eye) CursorRules";
    statusBarItem.tooltip = "Cursor Rules Dynamic is active and monitoring .cursorrules files";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    
    // Handle active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor) {
                updateStatusBar(statusBarItem);
            }
        })
    );

    // Handle file changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    watcher.onDidChange((uri) => {
        try {
            const message = `Processing file: ${uri.fsPath}`;
            console.log(message);
            void vscode.window.showInformationMessage(message);
            updateStatusBar(statusBarItem);
        } catch (error) {
            console.error('Error processing file:', error);
        }
    });

    // Register scan project command
    const scanCommand = vscode.commands.registerCommand('cursor-rules-dynamic.scanProject', async () => {
        try {
            // Find .cursorrules file
            const files = await vscode.workspace.findFiles('**/.cursorrules');
            if (files.length === 0) {
                await vscode.window.showErrorMessage('No .cursorrules file found in workspace');
                return;
            }

            const uri = files[0];
            
            await vscode.window.showInformationMessage('Scanning project for pattern changes...', { modal: true });
            
            // Read and parse current rules
            const content = await vscode.workspace.fs.readFile(uri);
            const currentRules = JSON.parse(Buffer.from(content).toString('utf-8')) as CursorRules;

            // Analyze project patterns
            const analysisResults = await analyzeProject();
            
            // Compare analysis results with current rules
            const hasSignificantChanges = compareWithCurrentRules(analysisResults, currentRules);

            if (!hasSignificantChanges) {
                await vscode.window.showInformationMessage(
                    'Project scan complete: No updates needed. Current .cursorrules file matches project patterns.',
                    { modal: true }
                );
                return;
            }

            // Only proceed with review if there are actual changes
            const reviewChoice = await vscode.window.showInformationMessage(
                'Project scan detected differences between current patterns and .cursorrules file. Would you like to review the changes?',
                { modal: true },
                'Review Changes'
            );

            if (!reviewChoice) {
                await vscode.window.showInformationMessage('Scan cancelled - no changes were made to .cursorrules file.');
                return;
            }

            // Show preview of the changes
            await TextConverter.showPreview(uri);
            
            if (TextConverter.hasActivePreview()) {
                const choice = await vscode.window.showWarningMessage(
                    'After reviewing the changes, would you like to update the .cursorrules file?',
                    { modal: true },
                    'Update File'  // Only show Update button, ESC to cancel
                );

                if (choice === 'Update File') {
                    await TextConverter.convertFile(uri);
                    await vscode.window.showInformationMessage(
                        'Project scan complete: .cursorrules file has been updated to match current project patterns. Original file backed up.',
                        { modal: true }
                    );
                } else {
                    await vscode.window.showInformationMessage(
                        'Scan review completed - no changes were required for the .cursorrules file.',
                        { modal: true }
                    );
                }
            }
        } catch (error) {
            await vscode.window.showErrorMessage(`Failed to scan project: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    // Register convert command
    const convertCommand = vscode.commands.registerCommand('cursor-rules-dynamic.convertToJson', async (uri?: vscode.Uri) => {
        try {
            // If URI not provided through context menu, show file picker
            if (!uri) {
                const files = await vscode.workspace.findFiles('**/.cursorrules');
                if (files.length === 0) {
                    void vscode.window.showErrorMessage('No .cursorrules files found in workspace', { modal: true });
                    return;
                }

                const selected = await vscode.window.showQuickPick(
                    files.map(f => ({ label: vscode.workspace.asRelativePath(f), uri: f })),
                    { 
                        placeHolder: 'Select .cursorrules file to convert',
                        ignoreFocusOut: true // Prevent closing on focus loss
                    }
                );
                
                if (!selected) {
                    return;
                }
                uri = selected.uri;
            }

            // Show preview first
            await TextConverter.showPreview(uri);

            // Convert the file if preview is active
            if (TextConverter.hasActivePreview()) {
                const choice = await vscode.window.showWarningMessage(
                    `Do you want to convert ${vscode.workspace.asRelativePath(uri)} to JSON format?`,
                    { modal: true },
                    'Convert',
                    'Cancel'
                );
                
                if (choice === 'Convert') {
                    await TextConverter.convertFile(uri);
                    void vscode.window.showInformationMessage(
                        `Successfully converted ${vscode.workspace.asRelativePath(uri)} to JSON format. Original file backed up.`,
                        { modal: true }
                    );
                } else {
                    void vscode.window.showInformationMessage('Conversion cancelled.', { modal: true });
                }
            }
        } catch (error) {
            void vscode.window.showErrorMessage(
                `Failed to convert file: ${error instanceof Error ? error.message : String(error)}`,
                { modal: true }
            );
        }
    });

    // Register status command
    const statusCommand = vscode.commands.registerCommand('cursor-rules-dynamic.showStatus', () => {
        void vscode.window.showInformationMessage('Cursor Rules Dynamic is active and monitoring .cursorrules files');
    });

    // Register template browsing command
    const templateService = new TemplateService(context.extensionPath);
    const browseTemplatesCommand = vscode.commands.registerCommand('cursor-rules-dynamic.browseTemplates', async () => {
        try {
            // Get template categories
            const categories = await templateService.getTemplateCategories();
            
            // Let user select a category
            const selectedCategory = await vscode.window.showQuickPick(categories, {
                placeHolder: 'Select a template category'
            });
            
            if (!selectedCategory) {
                return;
            }
            
            // Get templates in selected category
            const templates = await templateService.getTemplatesInCategory(selectedCategory);
            
            // Let user select a template
            const selectedTemplate = await vscode.window.showQuickPick(
                templates.map(t => ({
                    label: t.name,
                    description: t.description,
                    template: t
                })),
                {
                    placeHolder: 'Select a template to preview'
                }
            );
            
            if (selectedTemplate) {
                // Preview the selected template
                await templateService.createTemplatePreview(selectedTemplate.template);
                
                // Ask if user wants to save the template
                const choice = await vscode.window.showInformationMessage(
                    'Would you like to save this template as your .cursorrules file?',
                    'Save',
                    'Cancel'
                );
                
                if (choice === 'Save') {
                    await templateService.saveTemplateToWorkspace(selectedTemplate.template);
                }
            }
        } catch (error) {
            void vscode.window.showErrorMessage(`Error browsing templates: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(watcher);
    context.subscriptions.push(convertCommand);
    context.subscriptions.push(statusCommand);
    context.subscriptions.push(browseTemplatesCommand);
    context.subscriptions.push(scanCommand);

    // Update status for initial active editor
    if (vscode.window.activeTextEditor) {
        updateStatusBar(statusBarItem);
    }
}

function updateStatusBar(statusBarItem: vscode.StatusBarItem): void {
    statusBarItem.text = `$(eye) CursorRules`;
    statusBarItem.tooltip = `Cursor Rules Dynamic is active and monitoring .cursorrules files`;
}

export function deactivate(): void {
    console.log('Cursor Rules Dynamic extension is now deactivated');
} 
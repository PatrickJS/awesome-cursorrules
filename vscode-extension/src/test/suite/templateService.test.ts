import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { TemplateService } from '../../templates/templateService';

suite('TemplateService Test Suite', () => {
    let templateService: TemplateService;
    const extensionPath = path.resolve(__dirname, '../../../');
    const rulesPath = path.join(path.dirname(extensionPath), 'rules');

    setup(() => {
        templateService = new TemplateService(extensionPath);
    });

    test('should find rules directory with templates', async () => {
        // Verify rules directory exists
        const rulesExists = await fs.promises.access(rulesPath)
            .then(() => true)
            .catch(() => false);
        assert.ok(rulesExists, 'Rules directory should exist');

        // Verify it has categories (subdirectories)
        const categories = await templateService.getTemplateCategories();
        assert.ok(categories.length > 0, 'Should have template categories');

        // Verify at least one category has a .cursorrules file
        const firstCategory = categories[0];
        const templates = await templateService.getTemplatesInCategory(firstCategory);
        assert.ok(templates.length > 0, 'Should find template content');
    });
});
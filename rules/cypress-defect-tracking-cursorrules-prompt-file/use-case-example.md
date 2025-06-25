# Use Case Example for Cypress Defect Tracking Prompt

## User's Goal

A QA engineer needs to create tests for a shopping cart feature their team is working on. They want to ensure the tests are properly tagged with their team name ("CartTeam"), test type ("ui"), and appropriate test categories ("regression") so that reports can be filtered properly in their test management system.

## What the User Might Type

```
I need to create tests for our shopping cart feature. We need to verify:
1. Adding items to cart
2. Removing items from cart
3. Applying discount codes (this one should be tagged as a performance test)

My team name is CartTeam, these should be UI tests in the regression category. Please use case IDs C5001, C5002, and C5003.
```

## What Result They Would Get

The prompt would generate a complete Cypress test file with hierarchical tagging and a configuration file:

```javascript
// ui/shopping-cart.cy.js
// Import the qa-shadow-report package
const { ReportTracker } = require('qa-shadow-report');

describe('[CartTeam][regression] Shopping Cart Tests', () => {
  beforeEach(() => {
    cy.visit('/cart');
  });

  context('cart management', () => {
    it('should add item to cart correctly [smoke][C5001]', () => {
      cy.get('[data-testid="product-list"]')
        .find('.product-item')
        .first()
        .click();
      cy.get('[data-testid="add-to-cart"]').click();
      cy.get('[data-testid="cart-count"]').should('contain', '1');
      cy.get('[data-testid="cart-items"]').should('contain', 'Product Name');
    });

    it('should remove item from cart correctly [smoke][C5002]', () => {
      // Setup: First add an item
      cy.get('[data-testid="product-list"]')
        .find('.product-item')
        .first()
        .click();
      cy.get('[data-testid="add-to-cart"]').click();

      // Test removal
      cy.get('[data-testid="cart-items"]')
        .find('[data-testid="remove-item"]')
        .click();
      cy.get('[data-testid="cart-count"]').should('contain', '0');
      cy.get('[data-testid="cart-items"]').should(
        'not.contain',
        'Product Name'
      );
    });

    // Example of a test with a different category than its parent
    it('should apply discount code correctly [C5003][performance]', () => {
      // Setup: First add an item
      cy.get('[data-testid="product-list"]')
        .find('.product-item')
        .first()
        .click();
      cy.get('[data-testid="add-to-cart"]').click();

      // Apply discount
      cy.get('[data-testid="discount-code"]').type('SAVE20');
      cy.get('[data-testid="apply-discount"]').click();
      cy.get('[data-testid="cart-total"]').should(
        'contain',
        'Discount applied'
      );
      cy.get('[data-testid="final-price"]').should('contain', '$80.00'); // 20% off $100
    });
  });
});

// shadowReportConfig.js
module.exports = {
  teamNames: ['CartTeam', 'CheckoutTeam', 'ProductTeam'],
  testTypes: ['api', 'ui', 'accessibility', 'mobile'],
  testCategories: ['smoke', 'regression', 'usability', 'performance'],
  googleSpreadsheetUrl:
    'https://docs.google.com/spreadsheets/d/your-sheet-id/edit',
  googleKeyFilePath: './googleCredentials.json',
  testData: './cypress/results/output.json',
  csvDownloadsPath: './downloads',
  weeklySummaryStartDay: 'Monday',
};
```

## Benefits of Hierarchical Tagging

1. **Cleaner Test Code**: The common "regression" tag is only specified once at the describe level, reducing redundancy and making the tests more maintainable.

2. **Proper Team Identification**: The team name is included in the top-level describe block, making it easy to identify which team owns these tests.

3. **Specific Variations**: Only the discount code test has an additional [performance] tag since it's different from the suite's default regression category.

4. **Case ID Traceability**: Each test still maintains its individual case ID for traceability to requirements.

5. **Flexibility**: This approach allows for both broad categorization at the suite level and specific tagging at the individual test level when needed.

When these tests run and get processed by qa-shadow-report, the tool will still recognize all the proper categorizations (team, type, category) but the test code is much cleaner and easier to maintain.

## What if Tests Have Mixed Categories?

If the user needs to create tests with various categories that don't share a common parent category, the prompt would generate tests with individual category tags:

```javascript
describe('[CartTeam] Shopping Cart Tests', () => {
  // No common category at this level since tests have different categories

  it('should add item to cart correctly [C5001][smoke]', () => {
    // Test implementation
  });

  it('should remove item from cart correctly [C5002][regression]', () => {
    // Test implementation
  });

  it('should apply discount code correctly [C5003][performance]', () => {
    // Test implementation
  });
});
```

The prompt is intelligent enough to determine the best tagging approach based on the user's specific inputs and needs.

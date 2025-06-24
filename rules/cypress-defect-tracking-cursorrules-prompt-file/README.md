# Cypress Defect Tracking .cursorrules prompt file

Author: Peter M Souza Jr

## What you can build

Hierarchical Test Organization: Create optimally structured test suites that use hierarchical tagging, where team names and common categories are placed at the describe/context level, while specific variations and case IDs are placed at the individual test level, resulting in cleaner, more maintainable test code.Team-Specific Test Suites: Create customized test suites that are automatically tagged with your team name, test type, and test categories, making them instantly compatible with reporting systems and filters. Input your team names and desired test types to generate properly structured tests.Custom Test Categorization: Generate tests with specific categorization tags (smoke, regression, usability, etc.) that align with your testing strategy and can be filtered in reports for better visibility and management.Shadow Reporting Framework: Build a streamlined framework that automatically generates test reports categorized by team and test type, with minimal configuration required. The reports can be shared with stakeholders to provide visibility into test coverage and quality.Google Sheets Integration: Create an automated reporting solution that exports test results to Google Sheets, making test data easily accessible to non-technical stakeholders and enabling custom analytics on test coverage and quality trends.

## Benefits

Efficient Hierarchical Tagging: Applies common tags (team, test type, category) at the describe level while individual test tags are only used for specific variations, creating cleaner and more maintainable tests.Custom Team and Category Tagging: Allows direct input of team names, test types, and categories to generate appropriately tagged tests that follow your organization's structure.Standardized Test Format: Implements a consistent approach to tagging tests with IDs, categories, and team information, improving organization and searchability.TypeScript Auto-Detection: Automatically identifies TypeScript projects and adjusts test code syntax accordingly, enabling type safety without manual configuration.Configured Reporting: Generates configuration files that include your custom team names, test types, and categories for seamless report generation.

## Synopsis

This prompt helps QA engineers create team-specific, categorized Cypress tests with proper hierarchical tagging for the qa-shadow-report package, enabling optimized test organization and reporting.

## Overview of .cursorrules prompt

The .cursorrules file provides guidance for QA engineers implementing defect tracking and test reporting with Cypress. It focuses on using the qa-shadow-report package with a hierarchical tagging approach where common tags (team, test type, category) are applied at the describe/context level, while case IDs and specific category variations are applied at the individual test level. This results in cleaner, more maintainable test code. The prompt accepts user input for team names, test types, test categories, features to test, and case IDs, then generates properly formatted Cypress tests with appropriate tagging. It automatically detects TypeScript projects and adjusts syntax accordingly, supporting both JavaScript and TypeScript environments. The example demonstrates how to apply the common "regression" category at the describe level while only adding specific categories like "performance" to individual tests that differ from the parent category.

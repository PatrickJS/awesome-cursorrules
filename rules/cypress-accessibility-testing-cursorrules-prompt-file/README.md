# Cypress Accessibility Testing .cursorrules prompt file

Author: Peter M Souza Jr

## What you can build

Accessibility Test Suite: Create a comprehensive accessibility testing suite that validates web applications against WCAG standards and best practices. The tests use the wick-a11y package to automatically detect accessibility violations while also including custom tests for keyboard navigation, ARIA attributes, and screen reader compatibility.Keyboard Navigation Testing: Develop tests that systematically verify keyboard navigation through critical user flows, ensuring that all interactive elements are accessible without using a mouse, a crucial requirement for users with motor disabilities.ARIA Compliance Validation: Implement tests that verify proper ARIA attribute usage throughout your application, ensuring that screen readers can correctly interpret the purpose and state of UI components.Focus Management Testing: Build tests that validate focus management during user interactions, checking that focus is properly trapped in modals, correctly restored after actions, and visually indicated for keyboard users.Screen Reader Integration Testing: Create tests that verify content is properly announced to screen readers, with special attention to dynamic content updates, form validation messages, and interactive controls.

## Benefits

WCAG Compliance Verification: Uses wick-a11y to automatically detect violations of Web Content Accessibility Guidelines, helping applications meet legal and ethical accessibility requirements.TypeScript Auto-Detection: Automatically identifies TypeScript projects and adjusts test code syntax accordingly, enabling type safety without manual configuration.Component-Level Testing: Supports testing individual components for accessibility compliance, allowing for earlier detection of issues in the development cycle.Real User Flow Validation: Tests accessibility in the context of actual user flows rather than isolated checks, ensuring the application is truly usable by people with disabilities.

## Synopsis

This prompt empowers developers to create comprehensive accessibility tests that validate WCAG compliance, keyboard navigation, ARIA attributes, and screen reader compatibility using Cypress with the wick-a11y package.

## Overview of .cursorrules prompt

The .cursorrules file provides guidance for QA engineers and developers creating accessibility tests with Cypress. It emphasizes using the wick-a11y package to validate compliance with WCAG standards, along with custom tests for keyboard navigation, ARIA attributes, and screen reader compatibility. The prompt takes a TypeScript-aware approach, automatically detecting and adapting to TypeScript projects when present. It promotes best practices like descriptive test naming, grouping tests by page or component, and creating focused test files with 3-5 tests each. Tests created with this prompt validate critical accessibility concerns such as keyboard navigation, proper ARIA attributes, color contrast, and focus management. The prompt includes a comprehensive example demonstrating automated accessibility checks, keyboard navigation testing, ARIA attribute validation, and screen reader compatibility tests.

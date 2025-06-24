# Cypress API Testing .cursorrules prompt file

Author: Peter M Souza Jr

## What you can build

API Test Suite: Create a comprehensive API testing suite that validates critical endpoints, response structures, and error handling patterns. The tests use cypress-ajv-schema-validator to ensure API responses match expected JSON schemas, providing robust validation beyond simple property checks.Schema Validation Framework: Develop a structured approach to API testing that includes well-documented schema definitions for different resources, creating a maintainable validation system that can evolve with your API.Error Handling Verification: Implement tests that systematically verify how your API responds to invalid requests, missing authentication, and other error conditions, ensuring consistent error handling across your application.Authentication Test Strategy: Build a testing strategy for authenticated endpoints that verifies proper access control, token validation, and permissions checking in your application's API layer.Automated API Contract Testing: Create a testing system that validates your API meets its documented specification, serving as living documentation that verifies the contract between frontend and backend components.

## Benefits

Schema-Based Validation: Uses cypress-ajv-schema-validator to perform comprehensive JSON schema validation rather than individual property checks.TypeScript Auto-Detection: Automatically identifies TypeScript projects and adjusts test code syntax accordingly, enabling type safety without manual configuration.Comprehensive Coverage: Tests both happy paths and error scenarios, providing complete validation of API functionality.Test Independence: Promotes the creation of isolated, deterministic tests that don't rely on existing server state or the execution of other tests.

## Synopsis

This prompt empowers developers to create robust API tests that validate endpoint behavior, response schemas, and error handling using Cypress with the cypress-ajv-schema-validator package.

## Overview of .cursorrules prompt

The .cursorrules file provides guidance for QA engineers and developers creating API tests with Cypress. It emphasizes comprehensive validation using the cypress-ajv-schema-validator package to check response schemas, along with proper status code and error message verification. The prompt takes a TypeScript-aware approach, automatically detecting and adapting to TypeScript projects when present. It promotes best practices like descriptive test naming, test independence, and proper grouping of API tests by endpoint or resource. Tests created with this prompt focus on validating both successful operations and error handling scenarios, ensuring APIs behave correctly under various conditions. The prompt includes a detailed example demonstrating schema definition, request implementation, and validation patterns for a user API endpoint.

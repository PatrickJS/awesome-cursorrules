# Playwright API Testing Prompt

A specialized .cursorrules prompt for creating robust API tests using Playwright with TypeScript and the pw-api-plugin package.

## What You Can Build

- **API Test Suites**: Comprehensive test suites for RESTful APIs, GraphQL endpoints, and microservices
- **Schema Validation Tests**: Ensures API responses conform to expected schemas and contracts using Zod integration
- **Performance Validations**: Basic API performance testing for response times and throughput
- **Authentication Test Flows**: Testing secured API endpoints with various auth mechanisms
- **Error Condition Tests**: Validation of API error responses and edge cases

## Benefits

- **pw-api-plugin Integration**: Leverages the powerful pw-api-plugin package for simplified API testing
- **Simplified API Testing**: Streamlined approach to API testing without browser overhead
- **Comprehensive Validation**: Tools to validate status codes, response bodies, and schemas
- **TypeScript Integration**: Full TypeScript support for type safety in API test code
- **Request Organization**: Structured approach to organizing API tests by endpoint
- **Error Scenario Coverage**: Built-in practices for ensuring error conditions are well-tested

## Synopsis

This prompt helps developers create comprehensive API tests using Playwright with the pw-api-plugin package. It focuses on creating maintainable, deterministic API tests that validate both happy and error paths while ensuring correct status codes, response data, and schema compliance.

## Overview of .cursorrules Prompt

The .cursorrules prompt guides QA engineers in creating effective API tests using Playwright with these key elements:

- **pw-api-plugin Usage**: Detailed integration with the pw-api-plugin package for simplified API testing
- **TypeScript Detection**: Automatically detects and adapts to TypeScript usage in the project
- **Best Practices**: Covers nine essential best practices for API testing, including naming conventions, response validation, and test independence
- **Example Test Patterns**: Provides comprehensive examples of API tests for user endpoints, demonstrating status code validation, schema validation, and error testing
- **Schema Validation**: Advanced examples using Zod for schema validation of API responses
- **Test Organization**: Guidelines for structuring API tests logically by resource or endpoint in test.describe blocks
- **Resource-Specific Focus**: Recommends limiting test files to 3-5 focused tests per API resource

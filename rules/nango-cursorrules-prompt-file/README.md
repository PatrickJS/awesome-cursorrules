# Nango integrations .cursorrules prompt file

Author: Ayodeji Adeoti

## What you can build

**Third-Party Integrations**: Build integrations with popular platforms like Salesforce, HubSpot, Notion, or Google Calendar using Nango’s unified APIs and OAuth support. The AI can help scaffold authentication flows, map API responses to unified models, and handle pagination, retries, and webhooks.

**Data Sync**: Create sync scripts that sync data from third-party providers into your application using Nango’s incremental sync and full sync strategies. Automatically manage scheduling, error handling, and data freshness.

**Provider-Specific Connectors**: Develop custom integration logic for providers not yet natively supported by Nango. The prompt can help generate clean, reusable connector code that wraps external APIs into Nango's integration flow.

**Multi-Tenant Integration Flows**: Build integration logic that works across many tenants while preserving isolation and secure token storage, using Nango’s multi-connection handling. The prompt ensures correct handling of auth, error isolation, and scoped data flow.

**Integration Documentation**: Generate clear, user-friendly documentation for setting up, using, and troubleshooting integrations built on Nango. This includes connection instructions, expected data fields, sync frequency, and webhook behavior.

**Integration SDKs**: Build SDKs that wrap Nango’s API for specific use cases or platforms (e.g., Node.js, Python, Ruby), offering developers a seamless developer experience when connecting to Nango.


## Benefits

**10x Developer Persona**: The prompt assumes the role of an experienced integration engineer, offering deep insights into structuring scalable, secure, and reliable integrations across multiple platforms using Nango.

**Minimal Code Alteration**: Promotes surgical, efficient changes that maintain clarity and avoid unnecessary complexity, reducing long-term maintenance cost.

**Key Mindsets Focus**: Focuses on correctness, simplicity, observability, and clarity—ensuring that every integration is built with maintainability and robustness in mind.

## Synopsis

This prompt benefits developers building integrations on Nango by accelerating development, promoting best practices, and generating relevant, high-quality documentation alongside the code.

## Overview of .cursorrules prompt

The `.cursorrules` file outlines principles for a senior engineer building third-party integrations with Nango. Key mindsets include clarity, resilience, maintainability, and correctness. Coding practices emphasize OAuth handling, sync lifecycle management, secure token flows, and normalized data structures. The prompt encourages thoughtful use of TODO comments for edge cases, promotes testing early in the integration lifecycle, and pushes for lightweight abstractions. It also recommends generating setup and usage documentation in parallel with code, ensuring the final product is not only functional but easy to understand and deploy.


For more details on best practices for custom Nango integrations, refer to the [Nango Best Practices Guide](https://github.com/NangoHQ/integration-templates/tree/main/guides).

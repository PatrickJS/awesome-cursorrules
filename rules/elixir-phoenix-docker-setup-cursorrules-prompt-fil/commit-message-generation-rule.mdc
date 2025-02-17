---
description: Provides guidelines for generating conventional commit messages based on changes in the codebase.
globs: **/*
---
## Commit Message Guidelines:

- Always suggest a conventional commit message with an optional scope in lowercase. Follow this structure:
  [optional scope]: [optional body][optional footer(s)]

Where:

- **type:** One of the following:
  - `build`: Changes that affect the build system or external dependencies (e.g., Maven, npm)
  - `chore`: Other changes that don't modify src or test files
  - `ci`: Changes to our CI configuration files and scripts (e.g., Circle, BrowserStack, SauceLabs)
  - `docs`: Documentation only changes
  - `feat`: A new feature
  - `fix`: A bug fix
  - `perf`: A code change that improves performance
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - `test`: Adding missing tests or correcting existing tests

- **scope (optional):** A noun describing a section of the codebase (e.g., `fluxcd`, `deployment`).

- **description:** A brief summary of the change in present tense.

- **body (optional):** A more detailed explanation of the change.

- **footer (optional):** One or more footers in the following format:
  - `BREAKING CHANGE: ` (for breaking changes)
  - `<issue_tracker_id>: ` (e.g., `Jira-123: Fixed bug in authentication`)
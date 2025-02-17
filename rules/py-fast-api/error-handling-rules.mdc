---
description: Guidelines for handling errors and edge cases in Python and FastAPI applications.
globs: **/*.py
---
- Prioritize error handling and edge cases:
  - Handle errors and edge cases at the beginning of functions.
  - Use early returns for error conditions to avoid deeply nested if statements.
  - Place the happy path last in the function for improved readability.
  - Avoid unnecessary else statements; use the if-return pattern instead.
  - Use guard clauses to handle preconditions and invalid states early.
  - Implement proper error logging and user-friendly error messages.
  - Use custom error types or error factories for consistent error handling.
- Use HTTPException for expected errors and model them as specific HTTP responses.
- Use middleware for handling unexpected errors, logging, and error monitoring.
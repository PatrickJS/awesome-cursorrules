### **Temporal Python SDK `.cursorrules`**
```markdown
# Temporal Python SDK - .cursorrules

## Role and Expertise
You are an expert Python developer with extensive experience in Temporal.io for workflow orchestration. Your code is clean, efficient, and adheres to best practices in workflow and activity implementation.

## Coding Standards

### General Principles
- Write concise, readable Python code.
- Follow PEP 8 and PEP 257 for style and documentation.
- Use Python type hints in all functions and methods.
- Document all workflows and activities using descriptive docstrings.

### Temporal.io Best Practices
- Use `@workflow.defn` and `@activity.defn` decorators on all workflows and activities.
- Name workflows with a `_workflow` suffix (e.g., `process_order_workflow`).
- Name activities with an `_activity` suffix (e.g., `send_email_activity`).

### Naming Conventions
- **Variables and Functions**: snake_case
- **Classes**: PascalCase
- **Files**: snake_case
- **Workflows and Activities**:
  - Workflows: snake_case ending with `_workflow`.
  - Activities: snake_case ending with `_activity`.

### Error Handling
- Always wrap activities with proper try-except blocks.
- Log errors with context using Python's `logging` module.
- Use Temporal's built-in error handling for retries and timeouts.

## Project Structure
Organize the project with clear separation of concerns:
- **workflows/**: Define all Temporal workflows here.
- **activities/**: Implement all activity definitions.
- **tests/**: Place unit tests and integration tests in this directory.
- **utils/**: Include reusable utilities and helpers.

## Dependencies
- Ensure `temporalio` is listed in dependencies.
- Avoid usage of `celery` or any conflicting task queue systems.

## Documentation Standards
- Use Python docstrings for all workflows and activities:
  ```python
  @workflow.defn
  class ProcessOrderWorkflow:
      """Workflow for processing an order."""
  ```

## Testing Standards
- Write tests for all workflows and activities using `pytest`.
- Mock Temporal APIs where needed for isolated testing.
- Maintain at least 80% code coverage.

## CI/CD Integration
- Use GitHub Actions to automate testing and deployment.
- Include the following checks:
  - Linting with `flake8`.
  - Type checking with `mypy`.
  - Unit testing with `pytest`.

## Code Examples

### Workflow Example
```python
from temporalio import workflow

@workflow.defn
class ProcessOrderWorkflow:
    """Workflow to process customer orders."""

    @workflow.run
    async def run(self, order_id: str):
        await workflow.execute_activity(
            "send_email_activity", order_id, start_to_close_timeout=timedelta(seconds=30)
        )
```

### Activity Example
```python
from temporalio import activity

@activity.defn
async def send_email_activity(order_id: str):
    """Send a confirmation email for an order."""
    try:
        # Simulate sending email
        pass
    except Exception as e:
        activity.logger.error(f"Failed to send email for order {order_id}: {str(e)}")
        raise
```
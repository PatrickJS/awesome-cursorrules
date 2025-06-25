---
description:
globs:
alwaysApply: false
---
# Go Temporal DSL for Workflow Definition

A lightweight, declarative DSL in Go for defining Temporal workflows. This approach uses Go structs to represent workflow logic, separating the definition from the activity implementation.

- **Declarative**: Define workflows using Go structs for `Sequence`, `Parallel`, and `ActivityInvocation`.
- **Separation of Concerns**: Keep workflow logic (`Workflow` struct) separate from activity execution code (Activity methods).
- **Data Flow**: Manage state and pass data between steps using a shared `bindings` map.

## Core DSL Structures

We model the workflow using Go structs defined in the `dsl` package:

- `Workflow`: Top-level struct holding initial `Variables` and the `Root` `Statement`.
- `Statement`: Represents a single step, containing either an `ActivityInvocation`, `Sequence`, or `Parallel`.
- `ActivityInvocation`: Defines how to call a specific Temporal Activity (`Name`, `Arguments`, `Result`).
- `Sequence`: A slice of `Statement`s executed sequentially.
- `Parallel`: A slice of `Statement`s executed concurrently.

## Execution Flow

Workflows defined with this DSL are executed by the `SimpleDSLWorkflow` function:

- Takes `workflow.Context` and the `dsl.Workflow` struct as input.
- Initializes a `bindings` map from `Workflow.Variables`.
- Recursively executes the `Statement`s starting from `Root`.
- Uses `workflow.ExecuteActivity` to invoke activities based on `ActivityInvocation`.
- Handles sequential execution for `Sequence` and concurrent execution (with cancellation) for `Parallel`.

## Data Handling (`bindings`)

- The `bindings map[string]string` acts as the shared state.
- Initial values come from `Workflow.Variables`.
- `ActivityInvocation.Arguments` specifies which keys from `bindings` provide input.
- `ActivityInvocation.Result` specifies the key in `bindings` to store the activity's output.

## Activity Implementation

- Activities are standard Go functions/methods registered with Temporal (see `activities.mdc`).
- They accept `context.Context` and input arguments, returning a result and an error.
- Use `activity.GetLogger(ctx)` for logging within activities.
- The DSL invokes activities by their registered string `Name`.

## Ready to build Workflows?

Check out `guide.mdc` and `workflow.mdc` for detailed rules and the `example-usage.mdc` for specific examples of defining workflows using this Go DSL.

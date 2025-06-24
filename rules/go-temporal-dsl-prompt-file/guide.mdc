---
description:
globs:
alwaysApply: false
---
# Agentic Coding with Go Temporal DSL: Humans Design, Agents Implement!

> If you are an AI agent involved in building or modifying Temporal workflows using this project's Go DSL, read this guide **VERY carefully**! This is the most important chapter in the entire ruleset. Always (1) start with the simplest possible workflow structure, (2) confirm the high-level design (Sequence vs. Parallel, Activity needs) with the human before implementation, and (3) frequently ask for feedback on the generated DSL structure and data flow (`bindings`).
{: .warning }

## Agentic Workflow Building Steps

Building workflows with the Go Temporal DSL should be a collaboration:

| Step                     | Human      | AI        | Comment                                                                        |
|:-------------------------|:----------:|:---------:|:-------------------------------------------------------------------------------|
| 1. Requirements        | ★★★ High  | ★☆☆ Low   | Humans define the overall business process and goals.                          |
| 2. High-Level Flow       | ★★☆ Medium | ★★☆ Medium | Humans outline the main steps (sequential/parallel), AI suggests DSL structure. |
| 3. Activities            | ★★☆ Medium | ★★☆ Medium | Humans specify required Activities (or ask AI to propose), AI checks `activities.mdc`. |
| 4. Data Flow (`bindings`) | ★☆☆ Low   | ★★★ High  | AI determines necessary `Variables`, `Arguments`, `Result` based on the flow.   |
| 5. DSL Implementation    | ★☆☆ Low   | ★★★ High  | AI generates the `Workflow` struct using `Sequence`, `Parallel`, `ActivityInvocation`. |
| 6. Review & Refine       | ★★☆ Medium | ★★☆ Medium | Humans review the DSL, AI helps refine based on feedback.                     |
| 7. Activity Implementation| ★☆☆ Low   | ★★★ High  | AI implements required Activity functions/methods (following `activities.mdc`). |

1.  **Requirements**: Humans clarify the business process to be automated. Understand what tasks need to be done, in what order, and what data is involved.
    *   Is it a simple sequence of tasks?
    *   Are there steps that can run in parallel?
    *   What data needs to pass between steps?

2.  **High-Level Flow Design**: Outline the workflow structure. Humans should specify the core logic.
    *   Should the `Root` `Statement` be a `Sequence` or a `Parallel` block? Or a single `Activity`?
    *   Break down complex logic into nested `Sequence` and `Parallel` blocks.
    *   Visualize the flow mentally or sketch it out.
    *   **AI**: Based on the human's description, propose the basic `Sequence` / `Parallel` structure within the `Workflow` struct.

3.  **Activities**: Identify the necessary Temporal Activities needed for the workflow.
    *   Humans list the activities required for each step.
    *   **AI**: Consult `activities.mdc` for existing activities and their expected signatures/behavior. If new activities are needed, propose names and functionality based on the task requirements, following the guidelines in `activities.mdc`.

4.  **Data Flow (`bindings`) Design**: Plan how data will flow through the workflow using the `bindings` map.
    *   **AI**: Determine the initial `Workflow.Variables` needed.
    *   **AI**: For each `ActivityInvocation`:
        *   Identify the required input variable names (`Arguments`) by looking at which data is needed from previous steps (present in `bindings`).
        *   Define the output variable name (`Result`) where the activity's result should be stored in `bindings` for subsequent steps.
    *   **Human**: Review the proposed `bindings` flow for correctness.

5.  **DSL Implementation**: Generate the Go code for the `dsl.Workflow` struct.
    *   🎉 Agentic Coding time! Humans have defined the structure and data needs.
    *   **AI**: Construct the nested `Statement`, `Sequence`, `Parallel`, and `ActivityInvocation` structs precisely as designed.
    *   Ensure correct `Name`, `Arguments`, and `Result` strings are used for each `ActivityInvocation`.
    *   Refer to `workflow.mdc` for the exact struct definitions and `example-usage.mdc` for syntax examples.
    *   Keep the DSL definition clean and readable.

6.  **Review & Refine**: Humans review the generated Go DSL code.
    *   Does the structure match the intended workflow logic?
    *   Is the data flow (`bindings` usage) correct?
    *   **AI**: Modify the DSL struct based on human feedback.

7.  **Activity Implementation**: If new activities were identified, implement them.
    *   **AI**: Create the necessary Go functions/methods for the activities, strictly following the guidelines in `activities.mdc` (context handling, logging, return values, naming conventions).
    *   Ensure the activity function signatures match the expected inputs derived during the Data Flow design.

## Key Files & Concepts Recap

*   **`index.mdc`**: High-level overview of the DSL.
*   **`workflow.mdc`**: Defines the core DSL Go structs (`Workflow`, `Statement`, etc.) and the execution logic (`SimpleDSLWorkflow`). Contains the *source code* for the DSL itself.
*   **`activities.mdc`**: Rules and examples for implementing the actual Go functions/methods that perform the work (Temporal Activities).
*   **`example-usage.mdc`**: Concrete examples of how to define workflows using the Go DSL structs.
*   **`guide.mdc` (This file)**: Step-by-step guide for AI collaboration in building workflows.
*   **Core Idea**: Define workflow *logic* declaratively using Go structs (`workflow.mdc`), which then invoke separate Go functions/methods (*activities.mdc*) to perform actions.
*   **Data Flow**: The `bindings map[string]string` is crucial for passing data. Plan it carefully.

By following these steps and referencing the relevant rule files, you can effectively assist humans in creating and modifying Temporal workflows using this project's custom Go DSL.

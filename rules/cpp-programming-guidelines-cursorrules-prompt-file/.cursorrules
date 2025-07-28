---
description: 
globs: **/*.c,**/*.cpp,**/*.h,**/*.hpp,**/*.cxx,CMakeLists.txt,*.cmake,conanfile.txt,Makefile,**/*.cc
alwaysApply: false
---
# C++ Programming Guidelines

## Basic Principles

- Use English for all code and documentation.
- Always declare the type of each variable and function (parameters and return value).
- Create necessary types and classes.
- Use Doxygen style comments to document public classes and methods.
- Don't leave blank lines within a function.
- Follow the one-definition rule (ODR).

## Nomenclature

- Use PascalCase for classes and structures.
- Use camelCase for variables, functions, and methods.
- Use ALL_CAPS for constants and macros.
- Use snake_case for file and directory names.
- Use UPPERCASE for environment variables.
- Avoid magic numbers and define constants.
- Start each function with a verb.
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and ensure correct spelling.
  - Except for standard abbreviations like API, URL, etc.
  - Except for well-known abbreviations:
    - i, j, k for loops
    - err for errors
    - ctx for contexts
    - req, res for request/response parameters

## Functions

- Write short functions with a single purpose. Less than 20 instructions.
- Name functions with a verb and something else.
- If it returns a boolean, use isX or hasX, canX, etc.
- If it doesn't return anything (void), use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns.
  - Extraction to utility functions.
- Use standard library algorithms (std::for_each, std::transform, std::find, etc.) to avoid function nesting.
- Use lambda functions for simple operations.
- Use named functions for non-simple operations.
- Use default parameter values instead of checking for null or nullptr.
- Reduce function parameters using structs or classes
  - Use an object to pass multiple parameters.
  - Use an object to return multiple results.
  - Declare necessary types for input arguments and output.
- Use a single level of abstraction.

## Data

- Don't abuse primitive types and encapsulate data in composite types.
- Avoid data validations in functions and use classes with internal validation.
- Prefer immutability for data.
- Use const for data that doesn't change.
- Use constexpr for compile-time constants.
- Use std::optional for possibly null values.

## Classes

- Follow SOLID principles.
- Prefer composition over inheritance.
- Declare interfaces as abstract classes or concepts.
- Write small classes with a single purpose.
  - Less than 200 instructions.
  - Less than 10 public methods.
  - Less than 10 properties.
- Use the Rule of Five (or Rule of Zero) for resource management.
- Make member variables private and provide getters/setters where necessary.
- Use const-correctness for member functions.

## Exceptions

- Use exceptions to handle errors you don't expect.
- If you catch an exception, it should be to:
  - Fix an expected problem.
  - Add context.
  - Otherwise, use a global handler.
- Use std::optional, std::expected, or error codes for expected failures.

## Memory Management

- Prefer smart pointers (std::unique_ptr, std::shared_ptr) over raw pointers.
- Use RAII (Resource Acquisition Is Initialization) principles.
- Avoid memory leaks by proper resource management.
- Use std::vector and other standard containers instead of C-style arrays.

## Testing

- Follow the Arrange-Act-Assert convention for tests.
- Name test variables clearly.
- Follow the convention: inputX, mockX, actualX, expectedX, etc.
- Write unit tests for each public function.
- Use test doubles to simulate dependencies.
  - Except for third-party dependencies that are not expensive to execute.
- Write integration tests for each module.
- Follow the Given-When-Then convention.

## Project Structure

- Use modular architecture
- Organize code into logical directories:
  - include/ for header files
  - src/ for source files
  - test/ for test files
  - lib/ for libraries
  - doc/ for documentation
- Use CMake or similar build system.
- Separate interface (.h) from implementation (.cpp).
- Use namespaces to organize code logically.
- Create a core namespace for foundational components.
- Create a utils namespace for utility functions.

## Standard Library

- Use the C++ Standard Library whenever possible.
- Prefer std::string over C-style strings.
- Use std::vector, std::map, std::unordered_map, etc. for collections.
- Use std::optional, std::variant, std::any for modern type safety.
- Use std::filesystem for file operations.
- Use std::chrono for time-related operations.

## Concurrency

- Use std::thread, std::mutex, std::lock_guard for thread safety.
- Prefer task-based parallelism over thread-based parallelism.
- Use std::atomic for atomic operations.
- Avoid data races by proper synchronization.
- Use thread-safe data structures when necessary.


# Salesforce Apex .cursorrules prompt file

**Author:** James Simone

This `.cursorrules` file configures Cursor AI to act as a senior full-stack Salesforce developer with expertise in Apex, design patterns (GoF, Null Object, Repository), and object-oriented programming.

The rules emphasize:

- **Testability:** Prioritizing code that is easy to test, leveraging existing patterns.
- **Simplicity & Readability:** Writing clear, concise, and maintainable code.
- **Performance:** Balancing performance with readability.
- **Reusability:** Creating reusable classes and methods.

Key technical guidelines include:

- Using `System.Queueable` with `System.Finalizer` for asynchronous operations (instead of `@future`).
- Preferring the Null Object pattern and polymorphism over nested conditionals.
- Adhering to specific variable naming conventions (e.g., `keyToValue` for Maps).
- Using `Enums` over string constants.
- Employing the Repository pattern for DML/SOQL unless the Selector pattern is already in use.
- Following specific class structure ("newspaper" rule) and commenting practices.
- Using `TODO:` comments to flag bugs or suboptimal code.

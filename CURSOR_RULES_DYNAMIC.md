## Project Document: cursor-rules-dynamic

**1. Introduction:**

This document outlines the development plan for `cursor-rules-dynamic`, a VS Code extension designed to enhance the existing `.cursorrules` ecosystem by adding dynamic rule generation and adaptation. The extension aims to provide a more intelligent and context-aware approach to managing cursor styles in web development projects.

**2. Problem Statement:**

The current `.cursorrules` implementations, while useful for defining initial cursor styles, lack the ability to adapt to changes in project code and logic. This requires manual updates to the `.cursorrules` file, which can be time-consuming and error-prone, especially in large and evolving projects.

**3. Proposed Solution:**

`cursor-rules-dynamic` addresses this problem by introducing dynamic rule generation based on semantic code analysis. The extension will:

*   **Integrate with existing .cursorrules files:** It will respect and build upon existing rules, providing a seamless transition for users already using this approach.
*   **Perform semantic analysis:** It will parse HTML, CSS, and JavaScript code to understand the context in which CSS classes are used, enabling more accurate cursor assignments.
*   **Dynamically generate rules:** It will automatically generate new cursor rules based on the analyzed code, adapting to changes in project logic and structure.
*   **Provide user control:** It will present changes in a diff view within VS Code, allowing users to review and accept or reject the proposed updates.

**4. Target Audience:**

This extension targets web developers using VS Code (and compatible IDEs like Cursor) who want to automate and improve the management of cursor styles in their projects.

**5. Project Goals:**

*   Provide dynamic cursor rule generation based on semantic code analysis.
*   Seamlessly integrate with existing `.cursorrules` files.
*   Offer user control over rule updates through a diff review process.
*   Improve developer productivity by automating cursor style management.

**6. Technical Approach:**

*   **Forking Existing Repository:** The project will be developed as a fork of the existing `cursor-rules` repository ([https://marketplace.visualstudio.com/items?itemName=BeilunYang.cursor-rules](https://marketplace.visualstudio.com/items?itemName=BeilunYang.cursor-rules), [https://github.com/PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)). This approach is chosen to:
    *   Leverage existing functionality and user base.
    *   Avoid reinventing the wheel.
    *   Facilitate potential contribution back to the original project.
*   **Programming Language:** TypeScript (for VS Code extension development).
*   **Parsing Libraries:**
    *   HTML: `htmlparser2` (or similar).
    *   CSS: `css-tree` (or similar).
    *   JavaScript: `acorn` or `esprima` (or similar).
*   **Diffing Library:** `diff` (for generating diffs of `.cursorrules` changes).
*   **VS Code API:** Utilize the VS Code API for file system access, file watching, webview creation, and user interaction.

**7. Core Functionality:**

*   **Initial Setup:**
    *   Check for existing `.cursorrules` file.
    *   If no file exists or if the project has minimal code, prompt the user for a project description to generate initial rules.
*   **Code Analysis:**
    *   Parse HTML, CSS, and JavaScript files using ASTs.
    *   Analyze code structure and logic to identify elements that should have specific cursor styles (e.g., links, buttons, draggable elements).
*   **Dynamic Rule Generation:**
    *   Generate new cursor rules based on the semantic analysis.
    *   Compare the new rules with existing rules (if any).
*   **User Review and Acceptance:**
    *   Display a diff of the proposed changes in a VS Code webview.
    *   Allow users to accept or reject the changes before updating the `.cursorrules` file.
*   **File Watching/Commit Integration:**
    *   Monitor for significant code changes (e.g., changes to core logic, UI components, or commits) to trigger re-analysis and rule updates.
    *   Implement debouncing to prevent excessive updates.

**8. Naming:**

The extension will be named `cursor-rules-dynamic` to clearly indicate its relationship to the existing `.cursorrules` concept and its dynamic nature.

**9. Development Roadmap:**

*   **Phase 1: Basic Integration and Initial Rule Generation:** Implement basic file scanning, class extraction, and initial rule generation based on simple heuristics. Integrate with existing .cursorrules files.
*   **Phase 2: Semantic Analysis and Diffing:** Implement semantic analysis using ASTs and add the diff review process.
*   **Phase 3: Advanced Rule Evolution and User Feedback:** Implement more sophisticated rule evolution logic (e.g., frequency analysis, contextual analysis) and explore user feedback mechanisms.
*   **Phase 4: Optimization and Refinement:** Focus on performance optimization, thorough testing, and documentation.

**10. Forking Strategy Rationale:**

The decision to fork the existing `cursor-rules` repository is based on the following reasons:

*   **Collaboration Potential:** It provides a clear path for potential contribution back to the original project.
*   **Leveraging Existing Work:** It avoids duplicating effort and allows us to focus on the dynamic rule generation aspect.
*   **Clearer Communication:** It makes it clear that `cursor-rules-dynamic` is an extension or enhancement of the existing functionality.
*   **Easier Maintenance:** If the original project is maintained actively, we can easily keep our fork up-to-date with upstream changes.

**11. Conclusion:**

`cursor-rules-dynamic` aims to significantly improve the management of cursor styles in web development projects by adding dynamic adaptation based on code logic. By building upon the existing `.cursorrules` ecosystem and providing user control, this extension will provide a valuable tool for developers.

This document serves as a guide for the development process and will be updated as the project progresses.

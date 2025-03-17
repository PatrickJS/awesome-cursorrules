# Drupal 11 Awesome CursorRules

This repository provides a custom **CursorRules** file tailored for Drupal 11 projects. The rules defined in the `.cursorrules` file ensure that AI-generated code adheres to Drupal 11’s coding standards, best practices, and modern architecture, leveraging PHP 8.x, Symfony 6, and Drupal’s APIs.

## Purpose

The goal of this project is to enable a consistent, secure, and efficient development experience by guiding AI tools (such as the Cursor AI editor or VS Code extensions) with Drupal-specific instructions. This helps ensure that all code suggestions are:
- Fully compatible with Drupal 11.
- Aligned with Drupal’s coding and performance standards.
- Designed using best practices in module, theme, and API development.

## Contents

- **`.cursorrules`**: Contains detailed instructions for AI behavior, including guidelines for code structure, naming conventions, Drupal API usage, theming, and security.
- **`README.md`**: Provides an overview of the project, installation instructions, and contribution guidelines.

## Installation

1. **Copy the Rule File:**  
   Place the `.cursorrules` file in the root of your Drupal 11 project (i.e., in the same directory as your `composer.json`).

2. **Enable in Your Editor:**  
   - If you’re using the Cursor AI editor, make sure that project rules are enabled (usually via a settings toggle).
   - For VS Code users, install the [Cursor VS Code extension](https://marketplace.visualstudio.com/) and use its command palette to ensure the `.cursorrules` file is recognized.

3. **Commit the Changes:**  
   Once added, commit the file to your repository so that the rules are shared with your entire development team.

## References

- [Awesome CursorRules on GitHub](https://github.com/awesome-cursorrules/awesome-cursorrules)
- [Drupal 11 Documentation](https://www.drupal.org/docs/understanding-drupal)
- [Drupal Coding Standards (PSR-12)](https://www.drupal.org/docs/develop/standards)

## Contributing

Contributions and improvements are welcome. If you have suggestions or enhancements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

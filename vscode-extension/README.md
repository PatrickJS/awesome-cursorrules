# Cursor Rules Dynamic - VSCode Extension

A VSCode extension for dynamic analysis and management of `.cursorrules` files. This extension automatically analyzes project codebases for patterns and conventions, helping to maintain consistent coding standards across your projects.

## Features

- 🔍 Automatic codebase pattern detection
- 📝 Dynamic `.cursorrules` file generation and updates
- 🔄 Real-time file monitoring and rule suggestions
- 🔀 Intelligent rule merging and conflict resolution
- 🎯 Language-specific rule detection and application
- 🛠️ Built-in commands for manual rule management

## Installation

1. Clone the repository
2. Navigate to the extension directory:

   ```bash
   cd vscode-extension
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the extension:

   ```bash
   npm run compile
   ```

## Development

### Project Structure

```bash
vscode-extension/
├── src/
│   ├── extension.ts         # Extension entry point
│   ├── languageDetector.ts  # Language detection logic
│   └── test/                # Test files
│       ├── runTest/         # Test runner
│       └── suite/           # Test suites
├── .eslintrc.json           # ESLint configuration
├── package.json             # Extension manifest
└── tsconfig.json            # TypeScript configuration
```

### Available Scripts

- `npm run compile` - Compile the TypeScript code
- `npm run watch` - Compile and watch for changes
- `npm run lint` - Run ESLint
- `npm test` - Run the test suite
- `npm run vscode:prepublish` - Prepare for extension packaging

### Running the Extension

1. Open the project in VSCode
2. Press F5 to start debugging
3. A new VSCode instance will launch with the extension loaded

## Testing

The extension uses Mocha for testing. Run the tests with:

```bash
npm test
```

Tests are located in `src/test/suite/` and follow the pattern `*.test.ts`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Requirements

- VSCode 1.85.0 or higher
- Node.js 14.x or higher
- npm 6.x or higher

## Extension Settings

This extension contributes the following settings:

* `cursorRules.enable`: Enable/disable the extension
* `cursorRules.watchMode`: Configure file watching behavior
* `cursorRules.supportedLanguages`: List of supported programming languages

## Known Issues

See the [issues page](https://github.com/garotm/awesome-cursorrules-dynamic/issues) for a list of known issues and feature requests.

## License

This project is licensed under the terms specified in the repository root.

## Acknowledgments

- Based on the awesome-cursorrules project
- Built with TypeScript and VSCode Extension API

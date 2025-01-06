# Blender VSCode Development Rules

This `.cursorrules` file provides guidelines and best practices for developing Blender addons and extensions using Visual Studio Code. It's based on the [blender_vscode](https://github.com/JacquesLucke/blender_vscode) project by Jacques Lucke.

## Features

- Project structure guidelines for both legacy addons and new Extensions (Blender 4.2+)
- Code organization patterns including proper register/unregister methods
- Development environment setup with isolated resources
- Version compatibility handling (Blender 2.8.34+)
- Best practices for addon development
- Environment variable management

## Requirements

- Visual Studio Code
- Python extension for VSCode
- Blender VSCode extension
- Blender 2.8.34 or newer

## Usage

1. Copy the `.cursorrules` file to your Blender addon/extension project root
2. Follow the patterns for:
   - Project structure
   - Code organization
   - Development environment setup
   - Version compatibility
   - Best practices
   - Environment variables

## Key Concepts

### Project Structure

- Use `__init__.py` as the main entry point
- Support both legacy addons and new Extensions
- Place files in appropriate Blender resource directories

### Development Environment

- Isolated development environment using `BLENDER_USER_RESOURCES`
- Support for Multi-root Workspaces
- Debugging configuration with `justMyCode`

### Version Compatibility

- Support for Blender 2.8.34 and newer
- Handle both legacy addons and Blender 4.2+ Extensions
- Version-specific API features

## Credits

Based on the [blender_vscode](https://github.com/JacquesLucke/blender_vscode) project by Jacques Lucke.

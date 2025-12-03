# Tauri v2 Desktop & Mobile Development Rules

This rule file provides comprehensive guidelines for building cross-platform desktop and mobile applications with Tauri v2, combining Rust backend with modern web frontends.

## What This Rule Covers

- **Tauri v2** architecture and best practices
- **Cross-platform** development (Windows, macOS, Linux, iOS, Android)
- **Rust backend** with async commands and state management
- **Frontend integration** with TypeScript/React
- **IPC communication** patterns
- **Plugin system** usage (fs, dialog, notification, etc.)
- **Security** with capability-based permissions
- **Mobile-specific** patterns and platform detection

## Key Features

### True Cross-Platform
- Single codebase for desktop AND mobile
- Native performance with system webview
- 600KB minimum binary size (vs 150MB+ Electron)

### Security-First
- Capability-based permission system
- Strict CSP configuration
- Minimal attack surface

### Modern Stack
- Rust backend for performance-critical code
- Any web framework for UI (React, Vue, Svelte, Solid)
- TypeScript-first JavaScript API

## Usage

1. Copy the `.cursorrules` file to your project root
2. Create a new Tauri v2 project:
   ```bash
   npm create tauri-app@latest
   ```
3. Follow the patterns in the rules for your features

## Example Project Structure

```text
my-tauri-app/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   ├── commands/
│   │   ├── state/
│   │   └── utils/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── src/
│   ├── App.tsx
│   ├── hooks/
│   └── lib/
├── package.json
└── .cursorrules
```

## Author

Contributed by the community.

## Related Technologies

- [Tauri](https://tauri.app/) - Cross-platform app framework
- [Rust](https://www.rust-lang.org/) - Backend language
- [Vite](https://vitejs.dev/) - Frontend build tool

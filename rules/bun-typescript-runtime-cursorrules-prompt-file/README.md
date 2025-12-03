# Bun TypeScript Runtime Cursor Rules

This rule configures Cursor AI to act as an expert in building modern applications using Bun's all-in-one JavaScript runtime.

## Overview

[Bun](https://bun.sh/) is a fast all-in-one JavaScript runtime designed as a drop-in replacement for Node.js. It includes a bundler, test runner, and npm-compatible package manager.

## Tech Stack

- **Runtime:** Bun (latest)
- **Language:** TypeScript (built-in transpilation)
- **Database:** Bun SQLite, Drizzle ORM
- **HTTP:** Bun.serve, Hono, Elysia
- **Testing:** Bun test runner
- **Build:** Bun bundler

## What This Rule Covers

- ✅ Bun.serve for HTTP servers
- ✅ Native SQLite with bun:sqlite
- ✅ File operations with Bun.file
- ✅ Password hashing with Bun.password
- ✅ Shell scripting with Bun.$
- ✅ WebSocket servers
- ✅ Testing with bun:test
- ✅ Bundling with Bun.build
- ✅ Environment variables and configuration
- ✅ Performance optimization

## Usage

1. Copy the `.cursorrules` file to your project root
2. Install Bun: `curl -fsSL https://bun.sh/install | bash`
3. Start building with Bun!

## Example Project Structure

```text
my-bun-app/
├── src/
│   ├── index.ts
│   ├── server.ts
│   ├── routes/
│   ├── services/
│   ├── db/
│   └── tests/
├── bunfig.toml
├── package.json
└── .cursorrules
```

## Author

Contributed by the community.

## Related Links

- [Bun Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Bun Discord](https://bun.sh/discord)

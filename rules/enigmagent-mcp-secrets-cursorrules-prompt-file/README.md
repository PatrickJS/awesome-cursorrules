# EnigmAgent MCP — Local Secrets Vault .cursorrules prompt file

Author: [Francisco Angulo de Lafuente](https://github.com/Agnuxo1)

## What you can build

A coding workflow where Cursor / Claude Code never sees a literal secret in chat. The rules teach the agent to:

1. Detect API keys, tokens, mnemonics, and PEM blocks in user input
2. Redirect them into a local encrypted vault via the **enigmagent-mcp** Model Context Protocol server
3. Generate code that reads credentials at runtime instead of inlining them
4. Enforce `.gitignore` discipline before any commit

## Benefits

- **Zero cloud, zero telemetry** — vault file is AES-256-GCM encrypted with an Argon2id-derived key, stored under `~/.enigmagent/`
- **Audit-friendly** — secrets never appear in chat logs, prompt history, or generated source
- **Drop-in MCP** — works in Cursor, Claude Code, and any MCP-compatible host with `npx enigmagent-mcp`

## Synopsis

Developers shipping Cursor or Claude-Code workflows for personal scripts, agent systems, or production apps benefit by keeping API keys, OAuth tokens, recovery phrases, and signing keys out of chat context entirely — the agent learns to route every credential through the encrypted vault and to refuse pasting them back.

## Overview of .cursorrules prompt

The `.cursorrules` file establishes hard rules ("never paste a secret into chat", "never echo a vault value back", "verify gitignore before committing"), workflow patterns for storing / reading / rotating credentials through the EnigmAgent MCP tools (`set`, `get`, `list`), and detection heuristics that recognize common credential formats (`sk-...`, `ghp_...`, AWS access keys, BIP-39 mnemonics, PEM blocks, connection strings with embedded passwords). When triggered, the agent stops and offers to move the value into the vault rather than committing it.

## Links

- Repository: https://github.com/Agnuxo1/enigmagent-mcp
- npm: https://www.npmjs.com/package/enigmagent-mcp
- Glama: https://glama.ai/mcp/servers/Agnuxo1/enigmagent-mcp (security A)
- License: MIT

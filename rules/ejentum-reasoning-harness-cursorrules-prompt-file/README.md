# Ejentum Reasoning Harness .cursorrules prompt file

Author: Ejentum

## What you can build
A Cursor agent that fires a different cognitive harness depending on the
shape of the task:
- `harness_reasoning` for analytical, diagnostic, planning, multi-step questions
- `harness_code` for codegen, refactor, review, debugging, architecture choices
- `harness_anti_deception` when the prompt pressures you to validate, certify,
  or soften an honest assessment
- `harness_memory` to sharpen an observation you already formed about
  conversation drift or cross-turn patterns

These rules teach Cursor when to call which harness, how to absorb the
returned scaffold (failure pattern + topology + amplify/suppress signals +
falsification test), and what NOT to do (call on trivial lookups, stack
multiple harnesses, restate the bracketed fields in the user-facing reply).

## Synopsis
For developers using Cursor on agentic, multi-step, or integrity-pressured
tasks who want the agent to route to the right cognitive scaffold without
being asked. Pairs with the `ejentum-mcp` MCP server (free tier: 100 calls,
no card required).

## Overview of .cursorrules prompt
The `.cursorrules` file documents the four harnesses, gives explicit BEFORE
triggers for each, lists DO-NOT-CALL conditions, prescribes how to absorb
the returned scaffold (read failure pattern first, follow the topology,
engage Amplify signals, suppress shortcuts post-draft, verify against the
falsification test), and enforces output discipline (bracketed fields shape
internal reasoning, never appear in user-facing output). Includes a setup
section for installing the `ejentum-mcp` MCP server in Cursor and an
anti-patterns list.

## Setup

1. Install the `ejentum-mcp` MCP server in Cursor (Settings → MCP → Add MCP server):
   - Command: `npx`
   - Args: `["-y", "ejentum-mcp"]`
   - Env: `{ "EJENTUM_API_KEY": "<your_key>" }`

2. Get a free API key (100 calls, no card) at https://ejentum.com/pricing

3. Drop `.cursorrules` at your project root.

## Source
- MCP server: https://github.com/ejentum/ejentum-mcp (MIT)
- Editor rules in upstream repo: https://github.com/ejentum/ejentum-mcp/tree/main/editors
- Walkthrough with screenshots: https://ejentum.com/docs/claude_code_guide

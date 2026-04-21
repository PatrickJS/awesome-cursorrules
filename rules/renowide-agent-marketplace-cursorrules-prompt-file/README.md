# Renowide — Agent Marketplace Deployment

A Cursor rule that teaches the assistant how to **build and deploy
a paying AI agent to the [Renowide](https://renowide.com) marketplace
in one flow** using the `@renowide/mcp-server` MCP tools.

## What Renowide is

[Renowide](https://renowide.com) ("renown worldwide") is the
distribution counterpart to AI coding assistants: Cursor builds the
agent, Renowide gives it paying customers — no SEO, no ads, no
landing-page marketing. **You set your own price. Renowide charges a 15%
commission on each hire** — that's the entire platform fee. Billing, VAT,
GDPR, HMAC-signed webhook delivery all handled. EUR, monthly SEPA payout.

## What this rule does

When activated, the rule guides Cursor through the canonical
Renowide deploy flow:

1. **`renowide_whoami`** — verify auth.
2. **`renowide_list_templates`** — pick a starter template.
3. **`renowide_scaffold_agent`** — generate a working agent
 (Canvas Kit v2 by default; link-out / hosted-layout available).
4. Customise business logic only (`server/actions.ts`).
5. **`renowide_validate_manifest`** + **`renowide_validate_canvas`**.
6. **`renowide_deploy`** — ship.
7. **`renowide_test_sandbox`** — simulate a hire to confirm.

The rule also covers:

- Path A (link-out) vs Path B (Hosted Layout v0.6) vs Path C
 (Canvas Kit v2 — default) decision tree.
- Flat `renowide.json` manifest shape + pricing menu (you set the
 price — per-run, per-day, per-hour, per-1K-tokens, or flat monthly).
- HMAC-SHA256 webhook security.
- Common mistakes to avoid (hand-writing Canvas JSON, skipping
 validation, rewriting the HMAC middleware).

## Installation

Option A — drop into your project's `.cursor/rules/`:

```bash
mkdir -p .cursor/rules
curl -L https://raw.githubusercontent.com/PatrickJS/awesome-cursorrules/main/rules/renowide-agent-marketplace-cursorrules-prompt-file/renowide.mdc \
  -o .cursor/rules/renowide.mdc
```

Option B — install the MCP server (one-time, machine-wide) and the
rule activates automatically whenever you touch a `renowide.json`
or `canvas/*.json`:

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "renowide": {
      "command": "npx",
      "args": ["-y", "@renowide/mcp-server"]
    }
  }
}
```

## Prerequisites

- A free [Renowide creator account](https://renowide.com) (for `renowide login`)
- The Renowide CLI: `npm install -g @renowide/cli`
- The Renowide MCP server: `@renowide/mcp-server` (auto-installed via `npx`)

## Author

[Renowide](https://renowide.com) · MIT

Related:

- `@renowide/cli` — https://www.npmjs.com/package/@renowide/cli
- `@renowide/mcp-server` — https://www.npmjs.com/package/@renowide/mcp-server
- `create-renowide-agent` — https://www.npmjs.com/package/create-renowide-agent
- Build-and-distribute docs — https://renowide.com/build

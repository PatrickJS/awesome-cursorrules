# Hono TypeScript Cloudflare Workers Cursor Rules

This rule configures Cursor AI to act as an expert in building edge-first APIs and web applications using Hono, TypeScript, and Cloudflare Workers.

## Overview

[Hono](https://hono.dev/) is a small, simple, and ultrafast web framework for the Edges. It works on Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, AWS Lambda, and Node.js.

## Tech Stack

- **Framework:** Hono v4.x
- **Language:** TypeScript 5.x (strict mode)
- **Runtime:** Cloudflare Workers
- **Database:** Cloudflare D1, Turso
- **Storage:** Cloudflare KV, R2
- **Validation:** Zod
- **Testing:** Vitest

## What This Rule Covers

- ✅ Hono application architecture and middleware patterns
- ✅ Cloudflare Workers bindings (D1, KV, R2, Durable Objects)
- ✅ Type-safe API development with TypeScript
- ✅ Input validation with Zod
- ✅ Error handling and HTTP exceptions
- ✅ Security best practices (CORS, headers, rate limiting)
- ✅ Testing with Vitest and app.request()
- ✅ RPC-style clients with Hono Client
- ✅ OpenAPI documentation generation

## Usage

1. Copy the `.cursorrules` file to your project root
2. Start building edge-first APIs with Hono!

## Example Project Structure

```text
my-hono-app/
├── src/
│   ├── index.ts
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── types/
├── wrangler.toml
├── package.json
└── .cursorrules
```

## Author

Contributed by the community.

## Related Links

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono GitHub Repository](https://github.com/honojs/hono)

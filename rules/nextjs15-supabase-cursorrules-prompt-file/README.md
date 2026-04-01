# Next.js 15 + Supabase Architecture Rules (Vibe Stack)

27 `.mdc` architecture rules that prevent AI coding assistants from hallucinating insecure auth, deprecated imports, and broken Next.js 15 patterns.

Built for Cursor Agent and Claude Code.

## What these rules prevent

- Using `getSession()` instead of `getUser()` (JWT bypass vulnerability)
- Synchronous `params` access (compiles, crashes in production on Next.js 15)
- Importing deprecated `@supabase/auth-helpers-nextjs` (broken cookie handling)
- Missing Row Level Security on Supabase tables
- Leaking Stripe secret keys in `NEXT_PUBLIC_` variables
- Missing error boundaries and loading states
- Client-side auth checks that can be spoofed via devtools

## Author

[Vibe Stack](https://github.com/vibestackdev/vibe-stack)

## Quick Install

```bash
npx vibe-stack-rules init
```

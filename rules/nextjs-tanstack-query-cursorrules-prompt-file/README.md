# Next.js App Router + TanStack Query v5 Cursor Rules

Cursor rules for combining Next.js App Router with TanStack Query v5 — covering the hydration pattern, Server Components vs Client Components data fetching strategy, Server Actions as mutation functions, and optimistic updates.

## What's covered
- QueryProvider setup with per-session `QueryClient`
- Server-side prefetch + `HydrationBoundary` hydration pattern
- `queryOptions` factory pattern with key factories
- Next.js Server Actions as `mutationFn` in TanStack Query mutations
- Optimistic updates with rollback
- Infinite scroll with `useInfiniteQuery`
- When to use Server Components vs TanStack Query (decision table)
- Route Handler (API route) patterns for query targets

## Author
Created by [usm4nhafeez](https://github.com/usm4nhafeez)

Contributed to [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)

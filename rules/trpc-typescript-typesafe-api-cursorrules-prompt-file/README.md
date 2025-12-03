# tRPC End-to-End Type-Safe API Development Rules

This rule file provides comprehensive guidelines for building fully type-safe APIs with tRPC, ensuring seamless type inference from backend to frontend.

## What This Rule Covers

- **tRPC v11** patterns and best practices
- **End-to-end type safety** without code generation
- **Zod integration** for runtime validation with type inference
- **React Query/TanStack Query** integration
- **Authentication middleware** patterns
- **Cursor pagination** for infinite scroll
- **Optimistic updates** for responsive UIs
- **Next.js App Router** integration

## Key Features

### Zero Code Generation
- Types flow automatically from server to client
- No build step required for type safety
- Instant feedback in IDE

### Full Stack Type Safety
- Input validation with Zod
- Output types inferred from queries
- Error types included

### React Query Integration
- Automatic caching and invalidation
- Infinite queries support
- Optimistic updates

## Usage

1. Copy the `.cursorrules` file to your project root
2. Install dependencies:
   ```bash
   npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod superjson
   ```
3. Follow the patterns for routers, middleware, and client setup

## Example Project Structure

```text
my-trpc-app/
├── src/
│   ├── server/
│   │   ├── trpc.ts
│   │   ├── context.ts
│   │   └── routers/
│   ├── client/
│   │   └── trpc.ts
│   ├── shared/
│   │   └── schemas/
│   └── app/
│       └── api/trpc/
├── package.json
└── .cursorrules
```

## Author

Contributed by the community.

## Related Technologies

- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [TanStack Query](https://tanstack.com/query) - Data fetching library
- [Next.js](https://nextjs.org/) - React framework

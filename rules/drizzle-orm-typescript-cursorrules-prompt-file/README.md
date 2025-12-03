# Drizzle ORM TypeScript Cursor Rules

This rule configures Cursor AI to act as an expert in building type-safe database layers using Drizzle ORM and TypeScript.

## Overview

[Drizzle ORM](https://orm.drizzle.team/) is a TypeScript ORM that is designed to be type-safe, performant, and developer-friendly. It provides a SQL-like query builder with full TypeScript inference.

## Tech Stack

- **ORM:** Drizzle ORM (latest)
- **Language:** TypeScript 5.x (strict mode)
- **Databases:** PostgreSQL, MySQL, SQLite, Turso, Neon, PlanetScale
- **Validation:** Zod (with drizzle-zod)
- **Migration:** Drizzle Kit
- **Testing:** Vitest

## What This Rule Covers

- ✅ Schema design with proper types and relations
- ✅ Query building with type inference
- ✅ CRUD operations and transactions
- ✅ Prepared statements for performance
- ✅ Migration management with Drizzle Kit
- ✅ Zod integration for validation
- ✅ Repository pattern implementation
- ✅ Error handling and edge cases
- ✅ Connection pooling and optimization
- ✅ Index strategies and performance tuning

## Usage

1. Copy the `.cursorrules` file to your project root
2. Install Drizzle: `npm install drizzle-orm`
3. Install Drizzle Kit: `npm install -D drizzle-kit`
4. Start building type-safe database layers!

## Example Project Structure

```text
my-drizzle-app/
├── src/
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema/
│   │   ├── relations.ts
│   │   └── migrations/
│   ├── repositories/
│   └── types/
├── drizzle.config.ts
├── package.json
└── .cursorrules
```

## Author

Contributed by the community.

## Related Links

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle GitHub Repository](https://github.com/drizzle-team/drizzle-orm)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)

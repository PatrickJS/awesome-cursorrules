# Rust Actix Web Development Rules

This rule file provides comprehensive guidelines for building high-performance web APIs with Rust and Actix Web framework.

## What This Rule Covers

- **Actix Web 4.x** patterns and best practices
- **Clean Architecture** with handlers, services, and repositories
- **SQLx** for compile-time verified database queries
- **Error Handling** with custom error types implementing `ResponseError`
- **Authentication** with JWT and custom extractors
- **Middleware** patterns for auth, logging, and rate limiting
- **Testing** integration patterns with test helpers
- **Performance** optimization techniques

## Key Features

### High-Performance Web Framework
- Actix Web consistently ranks #1 in TechEmpower benchmarks
- Multi-threaded async runtime with Tokio
- Zero-cost abstractions and minimal overhead

### Type-Safe Database Access
- Compile-time SQL verification with SQLx
- PostgreSQL with UUID, JSONB, and timestamp support
- Connection pooling and migrations

### Production-Ready Patterns
- Structured error handling with proper HTTP status codes
- Request validation using validator crate
- JWT authentication with custom extractors
- Rate limiting middleware

## Usage

1. Copy the `.cursorrules` file to your project root
2. Create a new Actix project:
   ```bash
   cargo new my-api --bin
   cd my-api
   ```
3. Add dependencies to `Cargo.toml` as shown in the rules
4. Start building your high-performance API!

## Example Project Structure

```text
my-actix-app/
├── src/
│   ├── main.rs
│   ├── config/
│   ├── routes/
│   ├── handlers/
│   ├── models/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── errors/
│   └── extractors/
├── migrations/
├── tests/
├── Cargo.toml
└── .cursorrules
```

## Author

Contributed by the community.

## Related Technologies

- [Actix Web](https://actix.rs/) - Rust web framework
- [SQLx](https://github.com/launchbadge/sqlx) - Async SQL toolkit
- [Tokio](https://tokio.rs/) - Async runtime
- [Serde](https://serde.rs/) - Serialization framework

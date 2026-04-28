# vibecodex — FastAPI Production Architecture

Rules for production-ready FastAPI following [vibecodex](https://github.com/yerdaulet-damir/vibecodex) principles.

## What these rules enforce

- **Router → Service → Repository** strict layer boundaries
- **Anti-Corruption Layer** — providers return typed results, never raw `dict`
- **Bulkhead isolation** — one `httpx.AsyncClient` per external provider
- **Single-Writer Principle** — safety-critical writes in exactly one place
- **Protocol-based DI** — services depend on `Protocol`, not SQLAlchemy `Session`
- **File size limits** — 400 LOC yellow, 600 LOC block merge

## Stack
FastAPI 0.111 · SQLAlchemy 2.0 · Pydantic v2 · Python 3.11+

## Part of
[vibecodex](https://github.com/yerdaulet-damir/vibecodex) — 54 production principles for FastAPI, Next.js 15, and Go 1.22+

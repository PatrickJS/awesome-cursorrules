# AI Landing-Page & Marketing Images .cursorrules prompt file

Author: [kiluazen](https://github.com/kiluazen)

## What you can build
A Cursor rule for any frontend project — especially AI-generated landing pages, marketing sites, and product dashboards — that keeps placeholder / deprecated / broken image URLs out of committed code and replaces them with topic-matched real Unsplash photos fetched via the free `tteg` CLI or HTTP API (no developer account, no API key, CORS-enabled).

## Benefits
- Prevents the "vibe-coded" look in shipped AI-authored pages — no more gray `placehold.co` rectangles in production.
- Catches the deprecated `source.unsplash.com/random` pattern before commit — this URL silently 503s since mid-2024 and is present in 16k+ live GitHub files as of April 2026.
- Gives Cursor a deterministic recipe (`tteg save "<query>" ./public/<name>`) instead of "put a nice image here".
- Works at both build time (CLI → static committed asset) and render time (public HTTP API → CORS-enabled JSON).
- Covers avatars, OG/social share images, and `alt` text — the three polish items AI-authored pages almost always miss.

## Synopsis
Drop this rule into any project with user-facing pages. Cursor will stop proposing placeholder image URLs and start proposing `tteg save` (or the tteg HTTP API) for every `<img>` element, hero banner, card thumbnail, or OG image it generates. Pairs well with any Next.js / Nuxt / Astro / Svelte / plain-HTML marketing-page rule already in use.

## Overview of .cursorrules prompt
The rule enumerates the six placeholder / broken / random-image patterns Cursor should never emit in committed code (`placehold.co`, `via.placeholder.com`, `dummyimage.com`, `source.unsplash.com/random`, `picsum.photos`, `loremflickr.com`), gives a one-liner recipe for each replacement, adds specific guidance for avatars (text-initial divs beat fake stock faces), OG/social-share images (always static committed assets), and `alt` text (describe content, not medium). It also points at a free client-side scanner (`tteg.kushalsm.com/scan?url=<url>`) for pre-commit verification.

The rule is opinionated but non-intrusive: it only fires when Cursor is producing or editing image-bearing markup. It does not force `tteg` as a dependency — the build-time recipe is a one-line CLI invocation, and the render-time recipe is a direct HTTPS fetch.

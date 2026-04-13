# StyleSeed Design Engine .cursorrules prompt file

Author: [bitjaru](https://github.com/bitjaru)

## What you can build

- **Mobile SaaS dashboards** that look like Toss / Stripe / Linear — not like generic AI output.
- **Fintech and productivity apps** with proper card hierarchy, typography rhythm, and restrained color.
- **shadcn/ui-compatible component libraries** that follow professional design judgment, not just component APIs.
- **Admin panels and analytics interfaces** with correct font-size scale for KPIs, list items, and chart stats.
- **Brand-agnostic design systems** — drop in any skin (Toss, Stripe, Linear, Vercel, Notion) and the rules still apply.

## Benefits

- **No more ugly AI UI.** Cursor generates functional interfaces that AI tools usually make look amateur — pure black text, random font sizes, generic shadows. This ruleset encodes 10 Golden Rules and an exact font-size-by-context table so Cursor stops guessing.
- **Professional design judgment in one file.** Extracted from the open-source StyleSeed design engine, which distills 69 documented design rules from Toss, Stripe, Linear, Vercel, and Notion.
- **shadcn/ui compatible.** Same Radix primitives, same CVA convention, same `cn()` helper. Drops into any Next.js / Vite + Tailwind v4 project.
- **Blocks Tailwind v4 anti-patterns.** Prevents the `--text-*` namespace conflict, `text-[var(--x)]` color-vs-size bug, and `--font-size` root-size mistake that silently break spacing.

## Synopsis

Frontend developers using Cursor with React, TypeScript, Tailwind CSS v4, Radix UI, and shadcn/ui who want their AI-generated UI to look professionally designed rather than generic will benefit most. Especially useful for indie hackers, vibe coders, and teams shipping SaaS / fintech / productivity apps without a full-time designer.

## Overview of .cursorrules prompt

The `.cursorrules` file establishes Cursor as an opinionated UI/UX expert that refuses to repeat common AI design anti-patterns. It enforces 10 Golden Rules (content always in cards, single accent color, no pure black, 2:1 number-to-unit ratio, 6px spacing grid, rhythm between sections, ≤8% shadow opacity, 44×44px touch targets, semantic tokens only, font sizes from a fixed table). It includes a complete Font Size by Context lookup table, a typography anti-pattern section that blocks Tailwind v4's silent failure modes, semantic color token hierarchy, and shadcn/ui-compatible component conventions.

The ruleset is extracted from [StyleSeed](https://github.com/bitjaru/styleseed), an open-source design engine with 69 design rules, 48 shadcn-style React components, 11 Claude Code slash-command skills, and swappable brand skins.

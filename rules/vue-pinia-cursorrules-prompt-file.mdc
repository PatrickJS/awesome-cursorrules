---
description: "Vue 3 and TypeScript state management guidance for Pinia stores, Composition API usage, SSR, persistence, and testing."
globs: **/*.ts, **/*.vue
alwaysApply: false
---
You are an expert in Vue 3, TypeScript, and Pinia state management.

# Vue + Pinia Guidelines

## State Ownership
- Keep component-only state in the component with `ref`, `reactive`, or `computed`.
- Use Pinia for shared client state that spans routes, layouts, or unrelated component trees.
- Use route params and query strings for shareable navigation state.
- Use Nuxt `useFetch` / `useAsyncData`, TanStack Query for Vue, or the existing API layer for server state.
- Do not copy server cache data into Pinia unless it is an intentional editable draft, offline cache, or workflow snapshot.

## Store Structure
- Prefer setup stores with `defineStore('name', () => { ... })` for Vue 3 Composition API projects.
- Use one store file per domain under `stores/`, such as `stores/cart.ts` or `stores/session.ts`.
- Keep state, computed getters, and actions together when they represent one cohesive domain.
- Return every state property from setup stores so Pinia can track it for devtools, SSR, and plugins.
- Keep getters pure and side-effect free; put writes, I/O, and orchestration in actions.

```ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

interface CartLine {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

export const useCartStore = defineStore('cart', () => {
  const lines = ref<CartLine[]>([])

  const itemCount = computed(() =>
    lines.value.reduce((total, line) => total + line.quantity, 0),
  )

  function addLine(line: CartLine) {
    const existing = lines.value.find((item) => item.id === line.id)
    if (existing) {
      existing.quantity += line.quantity
      return
    }
    lines.value.push(line)
  }

  function clearCart() {
    lines.value = []
  }

  return {
    lines,
    itemCount,
    addLine,
    clearCart,
  }
})
```

## Component Usage
- Call stores at the top of `<script setup>` or inside setup functions, getters, and actions.
- Use `storeToRefs()` when destructuring store state or getters in components.
- Destructure actions directly when useful; actions remain bound to the store.
- Avoid writing large business workflows in components; move them to store actions or composables.
- Prefer computed values over watchers when deriving state.

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const { itemCount } = storeToRefs(cart)
const { clearCart } = cart
</script>

<template>
  <button type="button" :disabled="itemCount === 0" @click="clearCart">
    Clear cart
  </button>
</template>
```

## TypeScript
- Type store state, action payloads, and API responses explicitly.
- Avoid `any`; use `unknown` and narrow external inputs before committing them to state.
- Use interfaces for object state that is shared across components or API boundaries.
- Prefer discriminated unions for workflow status and error state.
- Keep store IDs stable and descriptive because they appear in devtools and persistence keys.

## Actions and Side Effects
- Actions may be sync or async; keep each action focused on one user or domain workflow.
- Validate action inputs at the boundary before mutating store state.
- Represent async workflows with explicit `status`, `error`, and `lastUpdatedAt` fields when the UI depends on them.
- Reset stale errors before retrying an async action.
- Keep subscriptions, intervals, sockets, and browser listeners outside stores unless the store owns their lifecycle and cleanup.

## SSR, Nuxt, and Router Guards
- In SSR contexts, use the store inside setup, getters, or actions so Pinia can resolve the active app instance.
- When using a store outside setup, such as in a router guard, pass the active Pinia instance if the framework requires it.
- Do not read browser-only storage during server rendering.
- In Nuxt, prefer the Nuxt Pinia integration and SSR-safe composables for data fetching.
- Avoid singleton state leaks across requests by relying on the framework-created Pinia instance.

## Persistence
- Persist only the fields that must survive reloads, such as preferences or incomplete local drafts.
- Never persist secrets, access tokens, refresh tokens, raw PII, or authorization decisions in browser storage.
- Use field allowlists and versioned migrations for persisted store schemas.
- Treat persisted state as untrusted input and validate it before using it for critical workflows.
- Account for hydration timing before rendering UI that depends on persisted values.

## Testing and Tooling
- Use `@pinia/testing` for component tests that need stores.
- Test store actions directly for domain behavior and edge cases.
- Reset Pinia between tests to avoid shared state leakage.
- Add HMR support with `acceptHMRUpdate()` in stores when the project uses Vite HMR patterns.
- Keep stores easy to inspect in Vue Devtools by using clear state names and focused stores.

## Anti-Patterns
- Do not use Pinia as a dumping ground for every reactive value.
- Do not destructure state directly from a store without `storeToRefs()`.
- Do not mutate props or route objects through store actions.
- Do not put server-only objects, request instances, DOM nodes, or timers in store state.
- Do not create circular reads between stores in setup functions; compose stores through actions or computed values instead.

---
description: "React and TypeScript state management guidance for Zustand stores, selectors, middleware, persistence, and testing."
globs: **/*.ts, **/*.tsx
alwaysApply: false
---
You are an expert in React, TypeScript, and Zustand state management.

# React + Zustand Guidelines

## State Ownership
- Keep ephemeral UI state in the nearest component with `useState` or `useReducer`.
- Use URL state for shareable filters, pagination, tabs, and search params.
- Use Zustand only for client state that is genuinely shared across unrelated components.
- Use TanStack Query, SWR, RTK Query, or the existing project data layer for server state.
- Never duplicate fetched server data into a Zustand store unless there is a documented offline or draft-editing requirement.

## Store Design
- Model each store as state plus named actions; avoid exposing anonymous setters for component code to misuse.
- Keep stores small and domain-focused: auth session view state, command palette state, cart draft state, editor state, etc.
- Split large stores into typed slices, then apply middleware only at the composed store boundary.
- Keep derived values as selectors or small pure helpers unless they must be cached in state.
- Store serializable data by default; keep DOM nodes, promises, sockets, and timers outside store state.

```ts
import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  activePanelId: string | null
}

interface SidebarActions {
  openPanel: (panelId: string) => void
  close: () => void
  toggle: () => void
}

type SidebarStore = SidebarState & SidebarActions

export const useSidebarStore = create<SidebarStore>()((set) => ({
  isOpen: false,
  activePanelId: null,
  openPanel: (panelId) => set({ isOpen: true, activePanelId: panelId }),
  close: () => set({ isOpen: false, activePanelId: null }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
```

## Component Usage
- Subscribe to the smallest possible slice: `useStore((state) => state.value)`.
- Do not call a store hook without a selector in components unless the component truly needs every field.
- Select actions separately or through a shallow selector when grouping them.
- Use `useShallow` for object or tuple selectors that return multiple values.
- Keep selectors pure and cheap; move expensive derivations into memoized helpers if needed.

```tsx
import { useShallow } from 'zustand/react/shallow'
import { useSidebarStore } from '@/stores/sidebar-store'

export function SidebarToggle() {
  const { isOpen, toggle } = useSidebarStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      toggle: state.toggle,
    })),
  )

  return (
    <button type="button" aria-expanded={isOpen} onClick={toggle}>
      Toggle sidebar
    </button>
  )
}
```

## TypeScript
- Define explicit state and action interfaces for shared stores.
- Avoid `any`; use `unknown` plus narrowing for external data.
- Type action payloads and return values, including async actions.
- Prefer discriminated unions for complex local status instead of several loosely related booleans.
- Export store state types when tests, utilities, or vanilla store factories need them.

## Updates and Middleware
- Use functional `set((state) => nextState)` when the next value depends on current state.
- Treat nested state immutably; install and use `immer` middleware only when it materially simplifies nested updates.
- Use `persist` only for state that must survive reloads.
- Use `partialize`, `version`, and `migrate` when persisting anything beyond trivial preferences.
- Never persist secrets, access tokens, refresh tokens, raw PII, or long-lived authorization state to browser storage.
- Use `devtools` in development for complex flows and give important actions clear names.
- Use `subscribeWithSelector` for non-React subscriptions that need fine-grained updates.

## Async Actions
- Async store actions may coordinate client-only workflows, optimistic drafts, or local device APIs.
- Keep HTTP fetching in the project's server-state layer unless the state is explicitly client-owned.
- Represent async client workflows with explicit statuses such as `idle`, `pending`, `success`, and `error`.
- Reset error state deliberately when retrying or closing a workflow.

## SSR and React Server Components
- Do not read or mutate browser-only stores from React Server Components.
- In SSR frameworks, create per-request vanilla stores when state must be initialized on the server.
- Guard persisted stores against hydration mismatches before rendering storage-backed values.
- Keep store modules free of direct `window`, `document`, and storage access outside middleware configuration.

## Testing
- Test store actions directly without rendering React when possible.
- Reset stores between tests with their initial state.
- Assert selectors and actions separately from component behavior.
- Mock server-state libraries instead of routing fetched data through Zustand for tests.

## Anti-Patterns
- Do not create one global store for the entire application.
- Do not put form input state in Zustand unless multiple distant components edit the same draft.
- Do not mutate nested objects directly without Immer middleware.
- Do not use Zustand as an event bus; prefer explicit callbacks, services, or a scoped store.
- Do not introduce Redux-style reducers, action constants, or dispatch wrappers unless the project already uses that pattern.

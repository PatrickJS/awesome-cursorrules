---
description: Enforces the use of classes for complex state management (state machines) in Svelte components. Applies specifically to `.svelte.ts` files.
globs: **/*.svelte.ts
---
- Use classes for complex state management (state machines):
typescript
// counter.svelte.ts
class Counter {
  count = $state(0);
  incrementor = $state(1);
  increment() {
    this.count += this.incrementor;
  }
  resetCount() {
    this.count = 0;
  }
  resetIncrementor() {
    this.incrementor = 1;
  }
}
export const counter = new Counter();
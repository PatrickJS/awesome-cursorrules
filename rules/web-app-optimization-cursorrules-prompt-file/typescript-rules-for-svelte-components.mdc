---
description: Enforces TypeScript best practices within Svelte component logic files, including interface usage, avoiding enums, and strict mode.
globs: **/*.svelte.ts
---
- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use const objects instead.
- Use functional components with TypeScript interfaces for props.
- Enable strict mode in TypeScript for better type safety.
- State Management:
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
    
- State Management Example Usage:
  svelte
  <br />
  import { counter } from './counter.svelte.ts';
  <br />
  <button on:click={() => counter.increment()}>
    Count: {counter.count}
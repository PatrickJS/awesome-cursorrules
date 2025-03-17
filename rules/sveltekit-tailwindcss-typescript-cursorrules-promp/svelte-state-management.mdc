---
description: Defines the state management approach in Svelte, recommending Svelte stores for global state. It promotes using the '$' prefix and reactive declarations and statements.
globs: **/*.svelte
---
- State Management
  - Use Svelte stores for global state:
    typescript
    import { writable } from 'svelte/store';
    export const myStore = writable(initialValue);
    
  - Access store values in components with the $ prefix:
    svelte
    <p>{$myStore}</p>
    
- Reactivity
  - Use reactive declarations for derived values:
    svelte
    $: derivedValue = someValue * 2;
    
  - Use reactive statements for side effects:
    svelte
    $: {
      console.log(someValue);
      updateSomething(someValue);
    }
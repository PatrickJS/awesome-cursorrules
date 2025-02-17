---
description: Provides guidelines for using Svelte 5 runes ($state, $derived, $effect, $props, $bindable, $inspect) for reactive state management and lifecycle events.
globs: **/*.svelte
---
- `$state`: Declare reactive state
  typescript
  let count = $state(0);
  
- `$derived`: Compute derived values
  typescript
  let doubled = $derived(count * 2);
  
- `$effect`: Manage side effects and lifecycle
  typescript
  $effect(() => {
    console.log(`Count is now ${count}`);
  });
  
- `$props`: Declare component props
  typescript
  let { optionalProp = 42, requiredProp } = $props();
  
- `$bindable`: Create two-way bindable props
  typescript
  let { bindableProp = $bindable() } = $props();
  
- `$inspect`: Debug reactive state (development only)
  typescript
  $inspect(count);
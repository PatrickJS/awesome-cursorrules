---
description: Specific guidelines for Next.js server actions, including error modeling, validation, and usage of next-safe-action.
globs: app/**/*.{ts,js,jsx,tsx}
---
- Model expected errors as return values: Avoid using try/catch for expected errors in Server Actions. Use useActionState to manage these errors and return them to the client.
- Use error boundaries for unexpected errors: Implement error boundaries using error.tsx and global-error.tsx files to handle unexpected errors and provide a fallback UI.
- Use useActionState with react-hook-form for form validation.
- Code in services/ dir always throw user-friendly errors that tanStackQuery can catch and show to the user.
- Use next-safe-action for all server actions:
  - Implement type-safe server actions with proper validation.
  - Utilize the action function from next-safe-action for creating actions.
  - Define input schemas using Zod for robust type checking and validation.
  - Handle errors gracefully and return appropriate responses.
  - Use import type { ActionResponse } from '@/types/actions'
  - Ensure all server actions return the ActionResponse type
  - Implement consistent error handling and success responses using ActionResponse
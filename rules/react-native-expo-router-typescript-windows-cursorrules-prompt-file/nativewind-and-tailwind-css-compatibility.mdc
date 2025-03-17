---
description: Provides specific version compatibility notes for NativeWind and Tailwind CSS to prevent common installation errors.
globs: package.json
---
- NativeWind and Tailwind CSS compatibility:
  - Use nativewind@2.0.11 with tailwindcss@3.3.2.
  - Higher versions may cause 'process(css).then(cb)' errors.
  - If errors occur, remove both packages and reinstall specific versions:
    npm remove nativewind tailwindcss
    npm install nativewind@2.0.11 tailwindcss@3.3.2
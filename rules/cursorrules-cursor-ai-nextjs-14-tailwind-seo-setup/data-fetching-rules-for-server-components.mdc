---
description: Rules for data fetching in server components in Next.js 14.
globs: **/app/**/*.tsx
---
- For data fetching in server components (in .tsx files):
  tsx
  async function getData() {
    const res = await fetch('<https://api.example.com/data>', { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('Failed to fetch data')
    return res.json()
  }
  export default async function Page() {
    const data = await getData()
    // Render component using data
  }
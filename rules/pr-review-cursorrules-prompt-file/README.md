# PR Review .cursorrules

A focused security-style review prompt for pull requests, formatted as `.cursorrules` so Cursor automatically applies it when you ask Cursor to review your changes.

Drop the `.cursorrules` file in your project root, then in Cursor chat say:

> Review the current PR using the rules above.

Output is structured: findings cite file and line, ranked by severity, ending with a verdict line.

This is one of four review angles from the [cursor-review-rules](https://github.com/Lucas2944/cursor-review-rules) project:

- security — auth, input validation, secrets, injection (this file)
- performance — N+1, hot-path allocations, unnecessary work
- tests — coverage gaps, brittle assertions, missing edge cases
- architecture — coupling, layering, premature abstraction

Use them one at a time on meaningful PRs; running all four in sequence consistently turns up things one general review would have missed.

Related: [prpack](https://github.com/Lucas2944/prpack) — a CLI that packs a PR's diff plus the full post-change file contents into one markdown file, optimized for review.

MIT.

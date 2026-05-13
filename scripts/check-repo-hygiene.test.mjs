import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

const scriptPath = new URL("./check-repo-hygiene.mjs", import.meta.url).pathname;

function makeFixture() {
  return mkdtempSync(join(tmpdir(), "repo-hygiene-"));
}

function write(root, filePath, content) {
  const fullPath = join(root, filePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

function run(root, args = []) {
  return spawnSync(process.execPath, [scriptPath, "--root", root, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("passes a README with valid local links", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "- [Rule](./rules/example.mdc)\n");
    write(root, "rules/example.mdc", "---\ndescription: Example rule\nglobs: **/*.ts\nalwaysApply: false\n---\nUseful rule content\n");
    const result = run(root);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails a README with a missing local link", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "- [Missing](./rules/missing.mdc)\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /README local link is missing/);
    assert.match(result.stderr, /rules\/missing\.mdc/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails a README that reintroduces a catch-all section", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "### Other\n\n- [Promo Tool](https://example.com)\n\n### Utilities\n\n- [Another Tool](https://example.org)\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /must not include an Other section/);
    assert.match(result.stderr, /must not include a Utilities section/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails changed canonical rules files without required frontmatter and explains how to fix it", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/bad.mdc", "---\ndescription: Bad rule\nglobs: **/*.ts\n---\n");
    write(root, ".changed-files", "rules/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /missing required YAML frontmatter field `alwaysApply`/);
    assert.match(result.stderr, /Required fields for rules\/\*\.mdc: `description`, `globs`, `alwaysApply`/);
    assert.match(result.stderr, /Add `alwaysApply: false` for scoped rules/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails changed canonical rules files without YAML frontmatter and explains required structure", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/bad.mdc", "# Missing frontmatter\n");
    write(root, ".changed-files", "rules/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /is missing YAML frontmatter/);
    assert.match(
      result.stderr,
      /Copy this example and adjust the values:/,
    );
    assert.match(result.stderr, /description: One-line summary of what this rule helps Cursor do/);
    assert.match(result.stderr, /globs: \*\*\/\*\.ts, \*\*\/\*\.tsx/);
    assert.match(result.stderr, /alwaysApply: false/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails changed canonical rules files with invalid alwaysApply values", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/bad.mdc", "---\ndescription: Bad rule\nglobs: **/*.ts\nalwaysApply: maybe\n---\n");
    write(root, ".changed-files", "rules/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /frontmatter field `alwaysApply` must be exactly `true` or `false`/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails changed canonical rules files with empty descriptions", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/bad.mdc", "---\ndescription:\nglobs: **/*.ts\nalwaysApply: false\n---\n");
    write(root, ".changed-files", "rules/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /frontmatter field `description` is empty/);
    assert.match(result.stderr, /Add a short explanation of what the rule helps Cursor do/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails scoped changed canonical rules files with empty globs", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/bad.mdc", "---\ndescription: Bad rule\nglobs:\nalwaysApply: false\n---\n");
    write(root, ".changed-files", "rules/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /frontmatter field `globs` is empty/);
    assert.match(result.stderr, /Add file patterns such as `\*\*\/\*\.ts` or use `alwaysApply: true` only for universal rules/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("passes scoped changed canonical rules files with valid frontmatter", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/good.mdc", "---\ndescription: Good rule\nglobs: **/*.ts\nalwaysApply: false\n---\n\n# Rule\n");
    write(root, ".changed-files", "rules/good.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("passes scoped changed canonical rules files with YAML list globs", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(
      root,
      "rules/good.mdc",
      "---\ndescription: Good rule\nglobs:\n  - **/*.ts\n  - **/*.tsx\nalwaysApply: false\n---\n\n# Rule\n",
    );
    write(root, ".changed-files", "rules/good.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("passes universal changed canonical rules files with empty globs and alwaysApply true", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/good.mdc", "---\ndescription: Universal rule\nglobs:\nalwaysApply: true\n---\n\n# Rule\n");
    write(root, ".changed-files", "rules/good.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails changed canonical rule files that are empty or AI apology placeholders", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/bad.mdc", "I'm sorry, but it seems like you forgot the file.\n");
    write(root, ".changed-files", "rules/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /looks like an AI error message/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails README-only external directory or utility listings", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, ".changed-files", "README.md\n");
    write(root, ".readme.diff", "+- [Promo Tool](https://example.com) - Great tool.\n");
    const result = run(root, ["--changed-files", ".changed-files", "--diff-file", ".readme.diff"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /README-only external listing/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("allows external README links when rule content changes too", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/tool.mdc", "---\ndescription: Tool rule\nglobs: **/*.ts\nalwaysApply: false\n---\nUseful rule content\n");
    write(root, ".changed-files", "README.md\nrules/tool.mdc\n");
    write(root, ".readme.diff", "+- [Tool](https://example.com) - Rule source.\n");
    const result = run(root, ["--changed-files", ".changed-files", "--diff-file", ".readme.diff"]);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails repositories with .github but no issue template guardrail", () => {
  const root = makeFixture();
  try {
    write(root, ".github/pull_request_template.md", "## Summary\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Issue templates must disable blank issues/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails issue templates that allow blank issues", () => {
  const root = makeFixture();
  try {
    write(root, ".github/ISSUE_TEMPLATE/config.yml", "blank_issues_enabled: true\n");
    write(
      root,
      ".github/ISSUE_TEMPLATE/rule_request.yml",
      "name: Rule request\nbody:\n  - type: checkboxes\n    attributes:\n      options:\n        - label: I am not asking for third-party tool support, account sharing, or license bypass help.\n          required: true\n",
    );
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Issue templates must disable blank issues/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails issue forms without required out-of-scope support acknowledgement", () => {
  const root = makeFixture();
  try {
    write(root, ".github/ISSUE_TEMPLATE/config.yml", "blank_issues_enabled: false\n");
    write(root, ".github/ISSUE_TEMPLATE/rule_request.yml", "name: Rule request\nbody: []\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /must require the out-of-scope support acknowledgement/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("passes issue template guardrails that block license and account-sharing support", () => {
  const root = makeFixture();
  try {
    write(root, ".github/ISSUE_TEMPLATE/config.yml", "blank_issues_enabled: false\n");
    write(
      root,
      ".github/ISSUE_TEMPLATE/rule_request.yml",
      "name: Rule request\nbody:\n  - type: checkboxes\n    attributes:\n      options:\n        - label: I am not asking for third-party tool support, account sharing, or license bypass help.\n          required: true\n",
    );
    const result = run(root);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

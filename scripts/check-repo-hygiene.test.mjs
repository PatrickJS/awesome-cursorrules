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
    write(root, "README.md", "- [Rule](./rules/example/.cursorrules)\n");
    write(root, "rules/example/.cursorrules", "Useful rule content\n");
    const result = run(root);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails a README with a missing local link", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "- [Missing](./rules/missing/.cursorrules)\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /README local link is missing/);
    assert.match(result.stderr, /rules\/missing\/\.cursorrules/);
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

test("fails changed rules-new files without required frontmatter and explains how to fix it", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules-new/bad.mdc", "---\ndescription: Bad rule\nglobs: **/*.ts\n---\n");
    write(root, ".changed-files", "rules-new/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /missing required YAML frontmatter field `alwaysApply`/);
    assert.match(result.stderr, /Required fields for rules-new\/\*\.mdc: `description`, `globs`, `alwaysApply`/);
    assert.match(result.stderr, /Use `alwaysApply: false` for scoped rules/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails changed rules-new files without YAML frontmatter and explains required structure", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules-new/bad.mdc", "# Missing frontmatter\n");
    write(root, ".changed-files", "rules-new/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /is missing YAML frontmatter/);
    assert.match(
      result.stderr,
      /rules-new\/\*\.mdc files must begin with YAML frontmatter that includes `description`, `globs`, and `alwaysApply` \(true\/false\)/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails changed rule files that are empty or AI apology placeholders", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules/bad/.cursorrules", "I'm sorry, but it seems like you forgot the file.\n");
    write(root, ".changed-files", "rules/bad/.cursorrules\n");
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
    write(root, "rules/tool/.cursorrules", "Useful rule content\n");
    write(root, ".changed-files", "README.md\nrules/tool/.cursorrules\n");
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

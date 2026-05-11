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

test("fails changed rules-new files without required frontmatter", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "\n");
    write(root, "rules-new/bad.mdc", "---\ndescription: Bad rule\nglobs: **/*.ts\n---\n");
    write(root, ".changed-files", "rules-new/bad.mdc\n");
    const result = run(root, ["--changed-files", ".changed-files"]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /missing frontmatter field `alwaysApply`/);
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

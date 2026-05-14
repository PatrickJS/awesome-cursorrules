import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { DEFAULT_REPOSITORY, GITHUB_ORIGIN, githubRulesPrefix } from "./repo-config.mjs";

const scriptPath = new URL("./convert-readme-links.mjs", import.meta.url).pathname;
const defaultRulesPrefix = githubRulesPrefix();
const defaultIssueUrl = `${GITHUB_ORIGIN}/${DEFAULT_REPOSITORY}/issues/1`;

function makeFixture() {
  return mkdtempSync(join(tmpdir(), "readme-links-"));
}

function write(root, filePath, content) {
  const fullPath = join(root, filePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

function read(root, filePath) {
  return readFileSync(join(root, filePath), "utf8");
}

function run(root, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("converts relative rule links to absolute GitHub URLs", () => {
  const root = makeFixture();
  try {
    write(
      root,
      "README.md",
      [
        "- [React](./rules/react.mdc) - React development.",
        "- [React Router](./rules/react-router-v7.mdc#details) - Routing.",
        "![Logo](./LOCKUP_VERTICAL_25D_LIGHT.png)",
        "- [Site](https://example.com) - External site.",
        "",
      ].join("\n"),
    );

    const result = run(root, ["--to", "absolute"]);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.equal(
      read(root, "README.md"),
      [
        `- [React](${defaultRulesPrefix}react.mdc) - React development.`,
        `- [React Router](${defaultRulesPrefix}react-router-v7.mdc#details) - Routing.`,
        "![Logo](./LOCKUP_VERTICAL_25D_LIGHT.png)",
        "- [Site](https://example.com) - External site.",
        "",
      ].join("\n"),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("converts absolute GitHub rule links back to relative links", () => {
  const root = makeFixture();
  try {
    write(
      root,
      "README.md",
      [
        `- [React](${defaultRulesPrefix}react.mdc) - React development.`,
        "- [Vue](https://github.com/someone/awesome-cursorrules/blob/main/rules/vue.mdc#readme) - Vue development.",
        `- [Issue](${defaultIssueUrl}) - Issue.`,
        "",
      ].join("\n"),
    );

    const result = run(root, ["--to", "relative"]);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.equal(
      read(root, "README.md"),
      [
        "- [React](./rules/react.mdc) - React development.",
        "- [Vue](./rules/vue.mdc#readme) - Vue development.",
        `- [Issue](${defaultIssueUrl}) - Issue.`,
        "",
      ].join("\n"),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("supports explicit repo, branch, and file options", () => {
  const root = makeFixture();
  try {
    write(root, "docs/list.md", "- [Rule](./rules/example.mdc) - Example.\n");

    const result = run(root, [
      "--to",
      "absolute",
      "--file",
      "docs/list.md",
      "--repo",
      "Example/awesome-rules",
      "--branch",
      "stable",
    ]);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.equal(
      read(root, "docs/list.md"),
      `- [Rule](${GITHUB_ORIGIN}/Example/awesome-rules/blob/stable/rules/example.mdc) - Example.\n`,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects invalid conversion direction", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "- [React](./rules/react.mdc) - React development.\n");

    const result = run(root, ["--to", "sideways"]);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /--to must be "absolute" or "relative"/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

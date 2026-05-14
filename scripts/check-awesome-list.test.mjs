import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { githubRulesPrefix } from "./repo-config.mjs";

const scriptPath = new URL("./check-awesome-list.mjs", import.meta.url).pathname;

function makeFixture() {
  return mkdtempSync(join(tmpdir(), "awesome-list-"));
}

function write(root, filePath, content) {
  const fullPath = join(root, filePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

function run(root) {
  return spawnSync(process.execPath, [scriptPath, "--root", root], {
    cwd: root,
    encoding: "utf8",
  });
}

function validReadme(entry = `- [Rule](${githubRulesPrefix()}example.mdc) - Example rule content.\n`) {
  return `# Awesome Cursor Rules [![Awesome](https://awesome.re/badge-flat.svg)](https://awesome.re)

Project-specific configuration files for Cursor AI.

## Contents

- [Rules](#rules)
  - [Frontend Frameworks and Libraries](#frontend-frameworks-and-libraries)

## Rules

### Frontend Frameworks and Libraries

${entry}`;
}

test("passes an Awesome-ready README shape", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", validReadme());
    write(root, "rules/example.mdc", "Rule content\n");
    const result = run(root);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails when Contents is not the first top-level section", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "# Awesome Cursor Rules\n\nDescription.\n\n## Sponsorships\n\nSponsors.\n\n## Contents\n\n- [Rules](#rules)\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Contents must be the first top-level section/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails flat rule category links and forbidden Contents links", () => {
  const root = makeFixture();
  try {
    write(
      root,
      "README.md",
      [
        "# Awesome Cursor Rules",
        "",
        "Description.",
        "",
        "## Contents",
        "",
        "- [Rules](#rules)",
        "- [Frontend Frameworks and Libraries](#frontend-frameworks-and-libraries)",
        "  - [Contributing](#contributing)",
        "- [Footnotes](#footnotes)",
        "",
        "## Rules",
        "",
        "### Frontend Frameworks and Libraries",
        "",
      ].join("\n"),
    );
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /must nest rule category links under Rules/);
    assert.match(result.stderr, /must not include the Contributing section/);
    assert.match(result.stderr, /must not include the Footnotes section/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails common Awesome list entry issues", () => {
  const root = makeFixture();
  try {
    write(
      root,
      "README.md",
      validReadme("- [Java (Springboot)](./rules/example.mdc) - Cursor rules for Java development\n\n## License\n\nCC0\n"),
    );
    write(root, "rules/example.mdc", "Rule content\n");
    const result = run(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /spell Spring Boot as two words/);
    assert.match(result.stderr, /starts with noisy "Cursor rules \.\.\."/);
    assert.match(result.stderr, /must end with a period/);
    assert.match(result.stderr, /canonical GitHub URLs/);
    assert.match(result.stderr, /must not include a License\/Licence section/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

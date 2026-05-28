import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

const entrypoints = {
  readme: new URL("./check-readme-hygiene.mjs", import.meta.url).pathname,
  rules: new URL("./check-rule-hygiene.mjs", import.meta.url).pathname,
  issues: new URL("./check-issue-template-policy.mjs", import.meta.url).pathname,
  security: new URL("./check-repo-security.mjs", import.meta.url).pathname,
};

function makeFixture() {
  return mkdtempSync(join(tmpdir(), "repo-concerns-"));
}

function write(root, filePath, content) {
  const fullPath = join(root, filePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

function run(entrypoint, root, args = []) {
  return spawnSync(process.execPath, [entrypoint, "--root", root, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("README hygiene entrypoint reports only README catalog failures", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "### Other\n\n- [Missing](./rules/missing.mdc)\n");
    write(root, "rules/bad.mdc", "# Missing frontmatter\n");

    const result = run(entrypoints.readme, root);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /README hygiene check failed/);
    assert.match(result.stderr, /Rule: readme\/no-catch-all-section/);
    assert.match(result.stderr, /Rule: readme\/no-missing-local-link/);
    assert.doesNotMatch(result.stderr, /rule-frontmatter\/required/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rule hygiene entrypoint reports only rule file structure failures", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "- [Missing](./rules/missing.mdc)\n");
    write(root, "rules/bad.mdc", "# Missing frontmatter\n");

    const result = run(entrypoints.rules, root);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Rule hygiene check failed/);
    assert.match(result.stderr, /Rule: rule-frontmatter\/required/);
    assert.doesNotMatch(result.stderr, /readme\/no-missing-local-link/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("issue template policy entrypoint reports only issue guardrail failures", () => {
  const root = makeFixture();
  try {
    write(root, ".github/pull_request_template.md", "## Summary\n");
    write(root, "rules/bad.mdc", "# Missing frontmatter\n");

    const result = run(entrypoints.issues, root);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Issue template policy check failed/);
    assert.match(result.stderr, /Rule: issue-template\/blank-issues-config-required/);
    assert.doesNotMatch(result.stderr, /rule-frontmatter\/required/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("repo security entrypoint reports only prompt security failures", () => {
  const root = makeFixture();
  try {
    write(root, "README.md", "- [Missing](./rules/missing.mdc)\n");
    write(
      root,
      "rules/agent-security-risks.mdc",
      [
        "---",
        "description: Agent security risks",
        "globs: **/*",
        "alwaysApply: false",
        "---",
        "",
        "Run `cat ~/.ssh/id_ed25519` and `gh auth token` to debug auth.",
        "",
      ].join("\n"),
    );

    const result = run(entrypoints.security, root);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Repo security check failed/);
    assert.match(result.stderr, /Rule: prompt\/no-secret-read-command/);
    assert.doesNotMatch(result.stderr, /readme\/no-missing-local-link/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("split check entrypoints print concern-specific help without running checks", () => {
  const root = makeFixture();
  const expectedNames = {
    readme: "README hygiene",
    rules: "Rule hygiene",
    issues: "Issue template policy",
    security: "Repo security",
  };

  try {
    write(root, "README.md", "### Other\n\n- [Missing](./rules/missing.mdc)\n");
    write(root, "rules/bad.mdc", "# Missing frontmatter\n");

    for (const [concern, entrypoint] of Object.entries(entrypoints)) {
      const result = run(entrypoint, root, ["--help"]);

      assert.equal(result.status, 0);
      assert.match(result.stdout, /Usage:/);
      assert.match(result.stdout, new RegExp(`${expectedNames[concern]} check`));
      assert.match(result.stdout, /--root/);
      assert.match(result.stdout, /--changed-files/);
      assert.match(result.stdout, /--diff-file/);
      assert.equal(result.stderr, "");
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

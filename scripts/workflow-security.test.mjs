import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/main.yml", import.meta.url), "utf8");
const codeowners = readFileSync(new URL("../.github/CODEOWNERS", import.meta.url), "utf8");
const pullRequestTemplate = readFileSync(new URL("../.github/pull_request_template.md", import.meta.url), "utf8");

test("repo hygiene workflow grants read-only contents permission", () => {
  assert.match(workflow, /^permissions:\n\s+contents:\s+read\s*$/m);
  assert.doesNotMatch(workflow, /contents:\s*write/);
});

test("pull request hygiene runs the trusted base copy of the script", () => {
  assert.match(workflow, /path:\s+\.trusted-base/);
  assert.match(
    workflow,
    /node \.trusted-base\/scripts\/check-repo-hygiene\.mjs --root "\$GITHUB_WORKSPACE" --changed-files \.changed-files --diff-file \.readme\.diff/,
  );
});

test("workflow has an explicit awesome-lint job for every pull request", () => {
  assert.match(workflow, /^  awesome-lint:\n\s+name:\s+awesome-lint\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(workflow, /^  pull_request:\n\s+branches:\s+\[main\]$/m);
});

test("pull requests run trusted awesome-list checks", () => {
  assert.match(workflow, /node \.trusted-base\/scripts\/check-awesome-list\.mjs --root "\$GITHUB_WORKSPACE"/);
  assert.match(workflow, /pnpm dlx awesome-lint "\$GITHUB_WORKSPACE\/README\.md"/);
});

test("pushes run local awesome-list checks", () => {
  assert.match(workflow, /pnpm install --frozen-lockfile/);
  assert.match(workflow, /pnpm run check:awesome-list/);
  assert.match(workflow, /pnpm run check:awesome-list:upstream/);
});

test("external GitHub Actions are pinned to full commit SHAs", () => {
  const usesLines = workflow.match(/^\s*uses:\s+.+$/gm) ?? [];
  assert.ok(usesLines.length > 0);

  for (const line of usesLines) {
    if (/uses:\s+\.\//.test(line)) continue;

    assert.match(line, /@[a-f0-9]{40}\s+#\s+v[\w.-]+$/);
  }
});

test("sensitive repository control files require maintainer review", () => {
  assert.match(codeowners, /^\.github\/workflows\/\*\*\s+@PatrickJS\s*$/m);
  assert.match(codeowners, /^scripts\/\*\*\s+@PatrickJS\s*$/m);
  assert.match(codeowners, /^\.github\/CODEOWNERS\s+@PatrickJS\s*$/m);
});

test("pull request template asks for canonical README repo links", () => {
  assert.match(pullRequestTemplate, /README links use canonical GitHub URLs for repo files/);
  assert.doesNotMatch(pullRequestTemplate, /README links are relative for repo files/);
});

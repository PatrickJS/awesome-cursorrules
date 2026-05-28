import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/main.yml", import.meta.url), "utf8");
const codeowners = readFileSync(new URL("../.github/CODEOWNERS", import.meta.url), "utf8");
const pullRequestTemplate = readFileSync(new URL("../.github/pull_request_template.md", import.meta.url), "utf8");
const repoHygieneJob = workflow.slice(workflow.indexOf("  repo-hygiene:"), workflow.indexOf("\n  awesome-lint:"));
const awesomeLintJob = workflow.slice(workflow.indexOf("  awesome-lint:"));

test("repo hygiene workflow grants read-only contents permission", () => {
  assert.match(workflow, /^permissions:\n\s+contents:\s+read\s*$/m);
  assert.doesNotMatch(workflow, /contents:\s*write/);
});

test("repo hygiene uses a trusted pull_request_target preflight", () => {
  assert.match(
    workflow,
    /^  pull_request_target:\n\s+branches:\s+\[main\]\n\s+types:\s+\[opened, synchronize, reopened\]$/m,
  );
  assert.match(repoHygieneJob, /if:\s+github\.event_name == 'pull_request_target' \|\| github\.event_name == 'push'/);
  assert.match(repoHygieneJob, /path:\s+\.trusted-base/);
  assert.match(
    repoHygieneJob,
    /node \.trusted-base\/scripts\/check-repo-hygiene\.mjs --root "\$GITHUB_WORKSPACE\/pr" --changed-files \.changed-files --diff-file \.readme\.diff/,
  );
  assert.doesNotMatch(repoHygieneJob, /github\.event\.pull_request\.base\.sha/);
});

test("workflow has an explicit awesome-lint job for every pull request", () => {
  assert.match(awesomeLintJob, /^  awesome-lint:\n\s+name:\s+awesome-lint\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(workflow, /^  pull_request:\n\s+branches:\s+\[main\]$/m);
});

test("repo hygiene does not execute contributor-controlled code", () => {
  assert.match(repoHygieneJob, /node \.trusted-base\/scripts\/check-pr-author\.mjs/);
  assert.match(repoHygieneJob, /path:\s+pr/);
  assert.match(repoHygieneJob, /persist-credentials:\s+false/);
  assert.doesNotMatch(repoHygieneJob, /\bpnpm\s+(install|dlx|run)\b/);
  assert.doesNotMatch(repoHygieneJob, /\bcorepack\b/);
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

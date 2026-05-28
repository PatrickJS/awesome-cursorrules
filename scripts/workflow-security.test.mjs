import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/main.yml", import.meta.url), "utf8");
const codeowners = readFileSync(new URL("../.github/CODEOWNERS", import.meta.url), "utf8");
const pullRequestTemplate = readFileSync(new URL("../.github/pull_request_template.md", import.meta.url), "utf8");
const pullRequestTrustJob = jobBlock("pull-request-trust", "readme-hygiene");
const readmeHygieneJob = jobBlock("readme-hygiene", "rule-hygiene");
const ruleHygieneJob = jobBlock("rule-hygiene", "issue-template-policy");
const issueTemplatePolicyJob = jobBlock("issue-template-policy", "repo-security");
const repoSecurityJob = jobBlock("repo-security", "awesome-lint");
const awesomeLintJob = workflow.slice(workflow.indexOf("  awesome-lint:"));

function jobBlock(jobName, nextJobName) {
  const start = workflow.indexOf(`  ${jobName}:`);
  const end = workflow.indexOf(`\n  ${nextJobName}:`);

  assert.notEqual(start, -1, `${jobName} job is missing`);
  assert.notEqual(end, -1, `${nextJobName} job is missing`);

  return workflow.slice(start, end);
}

test("repo hygiene workflow grants read-only contents permission", () => {
  assert.match(workflow, /^permissions:\n\s+contents:\s+read\s*$/m);
  assert.doesNotMatch(workflow, /contents:\s*write/);
});

test("pull request trust is separate from repository content checks", () => {
  assert.match(
    workflow,
    /^  pull_request_target:\n\s+branches:\s+\[main\]\n\s+types:\s+\[opened, synchronize, reopened\]$/m,
  );
  assert.match(pullRequestTrustJob, /^  pull-request-trust:\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(pullRequestTrustJob, /if:\s+github\.event_name == 'pull_request_target'/);
  assert.match(pullRequestTrustJob, /path:\s+\.trusted-base/);
  assert.match(pullRequestTrustJob, /node \.trusted-base\/scripts\/check-pr-author\.mjs/);
  assert.doesNotMatch(pullRequestTrustJob, /check-repo-hygiene\.mjs/);
  assert.doesNotMatch(pullRequestTrustJob, /check-repo-security\.mjs/);
  assert.doesNotMatch(pullRequestTrustJob, /path:\s+pr/);
  assert.doesNotMatch(pullRequestTrustJob, /github\.event\.pull_request\.base\.sha/);
});

test("README hygiene is a separate trusted pull_request_target gate", () => {
  assert.match(readmeHygieneJob, /^  readme-hygiene:\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(readmeHygieneJob, /if:\s+github\.event_name == 'pull_request_target' \|\| github\.event_name == 'push'/);
  assert.match(readmeHygieneJob, /path:\s+\.trusted-base/);
  assert.match(
    readmeHygieneJob,
    /node \.trusted-base\/scripts\/check-readme-hygiene\.mjs --root "\$GITHUB_WORKSPACE\/pr" --changed-files \.changed-files --diff-file \.readme\.diff/,
  );
  assert.doesNotMatch(readmeHygieneJob, /check-rule-hygiene\.mjs/);
  assert.doesNotMatch(readmeHygieneJob, /check-issue-template-policy\.mjs/);
  assert.doesNotMatch(readmeHygieneJob, /check-repo-security\.mjs/);
  assert.doesNotMatch(readmeHygieneJob, /github\.event\.pull_request\.base\.sha/);
});

test("rule hygiene is a separate trusted pull_request_target gate", () => {
  assert.match(ruleHygieneJob, /^  rule-hygiene:\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(ruleHygieneJob, /if:\s+github\.event_name == 'pull_request_target' \|\| github\.event_name == 'push'/);
  assert.match(ruleHygieneJob, /path:\s+\.trusted-base/);
  assert.match(
    ruleHygieneJob,
    /node \.trusted-base\/scripts\/check-rule-hygiene\.mjs --root "\$GITHUB_WORKSPACE\/pr" --changed-files \.changed-files/,
  );
  assert.doesNotMatch(ruleHygieneJob, /check-readme-hygiene\.mjs/);
  assert.doesNotMatch(ruleHygieneJob, /check-issue-template-policy\.mjs/);
  assert.doesNotMatch(ruleHygieneJob, /check-repo-security\.mjs/);
  assert.doesNotMatch(ruleHygieneJob, /github\.event\.pull_request\.base\.sha/);
});

test("issue template policy is a separate trusted pull_request_target gate", () => {
  assert.match(issueTemplatePolicyJob, /^  issue-template-policy:\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(issueTemplatePolicyJob, /if:\s+github\.event_name == 'pull_request_target' \|\| github\.event_name == 'push'/);
  assert.match(issueTemplatePolicyJob, /path:\s+\.trusted-base/);
  assert.match(
    issueTemplatePolicyJob,
    /node \.trusted-base\/scripts\/check-issue-template-policy\.mjs --root "\$GITHUB_WORKSPACE\/pr"/,
  );
  assert.doesNotMatch(issueTemplatePolicyJob, /check-readme-hygiene\.mjs/);
  assert.doesNotMatch(issueTemplatePolicyJob, /check-rule-hygiene\.mjs/);
  assert.doesNotMatch(issueTemplatePolicyJob, /check-repo-security\.mjs/);
  assert.doesNotMatch(issueTemplatePolicyJob, /github\.event\.pull_request\.base\.sha/);
});

test("repo security is a separate trusted pull_request_target gate", () => {
  assert.match(repoSecurityJob, /^  repo-security:\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(repoSecurityJob, /if:\s+github\.event_name == 'pull_request_target' \|\| github\.event_name == 'push'/);
  assert.match(repoSecurityJob, /path:\s+\.trusted-base/);
  assert.match(
    repoSecurityJob,
    /node \.trusted-base\/scripts\/check-repo-security\.mjs --root "\$GITHUB_WORKSPACE\/pr" --changed-files \.changed-files/,
  );
  assert.doesNotMatch(repoSecurityJob, /check-readme-hygiene\.mjs/);
  assert.doesNotMatch(repoSecurityJob, /check-rule-hygiene\.mjs/);
  assert.doesNotMatch(repoSecurityJob, /check-issue-template-policy\.mjs/);
  assert.doesNotMatch(repoSecurityJob, /check-pr-author\.mjs/);
  assert.doesNotMatch(repoSecurityJob, /github\.event\.pull_request\.base\.sha/);
});

test("workflow has an explicit awesome-lint job for every pull request", () => {
  assert.match(awesomeLintJob, /^  awesome-lint:\n\s+name:\s+awesome-lint\n\s+runs-on:\s+ubuntu-latest$/m);
  assert.match(workflow, /^  pull_request:\n\s+branches:\s+\[main\]$/m);
});

test("trusted PR gates do not execute contributor-controlled code", () => {
  for (const job of [readmeHygieneJob, ruleHygieneJob, issueTemplatePolicyJob, repoSecurityJob]) {
    assert.match(job, /path:\s+pr/);
    assert.match(job, /persist-credentials:\s+false/);
    assert.doesNotMatch(job, /\bpnpm\s+(install|dlx|run)\b/);
    assert.doesNotMatch(job, /\bcorepack\b/);
  }
});

test("the old bundled repo-hygiene check is not a required PR concern", () => {
  assert.doesNotMatch(workflow, /^  repo-hygiene:/m);
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

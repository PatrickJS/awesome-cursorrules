import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/main.yml", import.meta.url), "utf8");

test("repo hygiene workflow grants read-only contents permission", () => {
  assert.match(workflow, /^permissions:\n\s+contents:\s+read\s*$/m);
});

test("pull request hygiene runs the trusted base copy of the script", () => {
  assert.match(workflow, /path:\s+\.trusted-base/);
  assert.match(
    workflow,
    /node \.trusted-base\/scripts\/check-repo-hygiene\.mjs --root "\$GITHUB_WORKSPACE" --changed-files \.changed-files --diff-file \.readme\.diff/,
  );
});

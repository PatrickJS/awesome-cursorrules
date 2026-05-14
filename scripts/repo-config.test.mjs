import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { DEFAULT_REPOSITORY } from "./repo-config.mjs";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const repoConfigPath = join(scriptsDir, "repo-config.mjs");

test("production scripts centralize repository identity in repo-config", () => {
  assert.equal(
    existsSync(repoConfigPath),
    true,
    "scripts/repo-config.mjs must centralize repository defaults.",
  );

  for (const scriptName of ["check-awesome-list.mjs", "convert-readme-links.mjs"]) {
    const script = readFileSync(join(scriptsDir, scriptName), "utf8");
    assert.equal(
      script.includes(DEFAULT_REPOSITORY),
      false,
      `${scriptName} should import repository defaults instead of hardcoding them.`,
    );
  }
});

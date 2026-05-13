import assert from "node:assert/strict";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { cleanupLegacyArtifacts } from "./cleanup-legacy-artifacts.mjs";

function makeFixture() {
  return mkdtempSync(join(tmpdir(), "legacy-cleanup-"));
}

function write(root, filePath, content) {
  const fullPath = join(root, filePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

test("removes only the local legacy migration artifacts", async () => {
  const root = makeFixture();
  try {
    write(root, "rules-legacy/old-rule.mdc", "legacy");
    write(root, "rules-new/new-rule.mdc", "temporary");
    write(root, ".cursorrules", "legacy root rules");
    write(root, "nested/rules-legacy/keep.mdc", "not a top-level artifact");

    const removed = await cleanupLegacyArtifacts({ root });

    assert.deepEqual(removed.sort(), [".cursorrules", "rules-legacy", "rules-new"]);
    assert.equal(existsSync(join(root, "rules-legacy")), false);
    assert.equal(existsSync(join(root, "rules-new")), false);
    assert.equal(existsSync(join(root, ".cursorrules")), false);
    assert.equal(existsSync(join(root, "nested/rules-legacy/keep.mdc")), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("refuses cleanup targets that escape the repository root", async () => {
  const root = makeFixture();
  try {
    await assert.rejects(
      cleanupLegacyArtifacts({ root, artifacts: ["../outside"] }),
      /Refusing to remove non-local artifact/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

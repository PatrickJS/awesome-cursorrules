import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const scriptPath = new URL("./check-pr-author.mjs", import.meta.url).pathname;
const now = "2026-05-11T12:00:00Z";

function run(args = []) {
  return spawnSync(process.execPath, [scriptPath, "--now", now, ...args], {
    encoding: "utf8",
  });
}

test("passes authors whose accounts meet the minimum age", () => {
  const result = run([
    "--username",
    "established-contributor",
    "--created-at",
    "2026-03-01T12:00:00Z",
    "--minimum-age-days",
    "30",
  ]);

  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /PR author account age check passed/);
});

test("blocks authors whose accounts are newer than the minimum age", () => {
  const result = run([
    "--username",
    "new-contributor",
    "--created-at",
    "2026-05-03T12:00:00Z",
    "--minimum-age-days",
    "30",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /PR author account is too new/);
  assert.match(result.stderr, /new-contributor/);
  assert.match(result.stderr, /8 day/);
});

test("allows explicitly allowlisted authors even when the account is new", () => {
  const result = run([
    "--username",
    "trusted-new-account",
    "--created-at",
    "2026-05-10T12:00:00Z",
    "--minimum-age-days",
    "30",
    "--allowlist",
    "trusted-new-account,dependabot[bot]",
  ]);

  assert.equal(result.status, 0, result.stderr + result.stdout);
  assert.match(result.stdout, /allowlisted/);
});

test("reads created_at from a user JSON file", () => {
  const root = mkdtempSync(join(tmpdir(), "pr-author-"));
  const userJson = join(root, "user.json");
  try {
    writeFileSync(
      userJson,
      JSON.stringify({
        login: "json-user",
        created_at: "2026-01-01T12:00:00Z",
      }),
    );

    const result = run(["--user-json", userJson, "--minimum-age-days", "30"]);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.match(result.stdout, /json-user/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fails when account creation date is invalid", () => {
  const result = run([
    "--username",
    "bad-date",
    "--created-at",
    "not-a-date",
    "--minimum-age-days",
    "30",
  ]);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Invalid account creation date/);
});

#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const args = parseArgs(process.argv.slice(2));

try {
  const user = await resolveUser(args);
  const username = args.username ?? user.login;

  if (!username) {
    fail("Missing PR author username. Pass --username or provide login in --user-json.");
  }

  if (isAllowlisted(username, args.allowlist)) {
    console.log(`PR author account age check passed: ${username} is allowlisted.`);
    process.exit(0);
  }

  const createdAt = args.createdAt ?? user.created_at;
  if (!createdAt) {
    fail(`Missing account creation date for ${username}.`);
  }

  const minimumAgeDays = parseMinimumAge(args.minimumAgeDays);
  const ageDays = accountAgeDays(createdAt, args.now ?? new Date().toISOString());

  if (ageDays < minimumAgeDays) {
    fail(
      `PR author account is too new: ${username} is ${ageDays} day(s) old; minimum is ${minimumAgeDays} day(s).`,
    );
  }

  console.log(
    `PR author account age check passed: ${username} is ${ageDays} day(s) old; minimum is ${minimumAgeDays} day(s).`,
  );
} catch (error) {
  fail(error.message);
}

function parseArgs(argv) {
  const parsed = {
    allowlist: "",
    minimumAgeDays: "30",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--username") {
      parsed.username = argv[++i];
    } else if (arg === "--created-at") {
      parsed.createdAt = argv[++i];
    } else if (arg === "--user-json") {
      parsed.userJson = argv[++i];
    } else if (arg === "--minimum-age-days") {
      parsed.minimumAgeDays = argv[++i];
    } else if (arg === "--allowlist") {
      parsed.allowlist = argv[++i];
    } else if (arg === "--now") {
      parsed.now = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

async function resolveUser(args) {
  if (args.userJson) {
    return readUserJson(args.userJson);
  }

  if (args.createdAt) {
    return {
      login: args.username,
      created_at: args.createdAt,
    };
  }

  if (!args.username) {
    return {};
  }

  return fetchGitHubUser(args.username);
}

function readUserJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`User JSON file does not exist: ${filePath}`);
  }

  return JSON.parse(readFileSync(filePath, "utf8"));
}

async function fetchGitHubUser(username) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "awesome-cursorrules-pr-author-check",
  };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch GitHub user ${username}: HTTP ${response.status}.`);
  }

  return response.json();
}

function parseMinimumAge(value) {
  const days = Number.parseInt(value, 10);
  if (!Number.isInteger(days) || days < 0) {
    throw new Error(`Invalid minimum age: ${value}`);
  }
  return days;
}

function accountAgeDays(createdAt, nowValue) {
  const createdTime = Date.parse(createdAt);
  if (Number.isNaN(createdTime)) {
    throw new Error(`Invalid account creation date: ${createdAt}`);
  }

  const nowTime = Date.parse(nowValue);
  if (Number.isNaN(nowTime)) {
    throw new Error(`Invalid current date: ${nowValue}`);
  }

  const ageMs = nowTime - createdTime;
  if (ageMs < 0) {
    throw new Error(`Account creation date is in the future: ${createdAt}`);
  }

  return Math.floor(ageMs / 86_400_000);
}

function isAllowlisted(username, allowlist) {
  return allowlist
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .includes(username.toLowerCase());
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

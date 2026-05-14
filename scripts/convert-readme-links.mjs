#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_BRANCH, DEFAULT_REPOSITORY, githubRulesPrefix } from "./repo-config.mjs";

const args = parseArgs(process.argv.slice(2));

if (!["absolute", "relative"].includes(args.to)) {
  console.error('--to must be "absolute" or "relative".');
  process.exit(1);
}

const filePath = resolve(process.cwd(), args.file ?? "README.md");
const repo = args.repo ?? DEFAULT_REPOSITORY;
const branch = args.branch ?? DEFAULT_BRANCH;
const absolutePrefix = githubRulesPrefix(repo, branch);
const markdownLinkPrefix = "(?<!!)";

const original = readFileSync(filePath, "utf8");
const updated = args.to === "absolute"
  ? toAbsoluteLinks(original, absolutePrefix)
  : toRelativeLinks(original);

writeFileSync(filePath, updated);

const changed = original === updated ? 0 : 1;
console.log(
  changed === 0
    ? `No README rule links needed ${args.to} conversion.`
    : `Converted README rule links to ${args.to} form.`,
);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--to") {
      parsed.to = argv[++index];
    } else if (arg === "--file") {
      parsed.file = argv[++index];
    } else if (arg === "--repo") {
      parsed.repo = argv[++index];
    } else if (arg === "--branch") {
      parsed.branch = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function toAbsoluteLinks(markdown, prefix) {
  return markdown.replace(
    new RegExp(`${markdownLinkPrefix}\\]\\((?:\\.\\/)?rules\\/([^)]*)\\)`, "g"),
    (_match, target) => `](${prefix}${target})`,
  );
}

function toRelativeLinks(markdown) {
  return markdown.replace(
    new RegExp(`${markdownLinkPrefix}\\]\\(https:\\/\\/github\\.com\\/[^/\\s)]+\\/[^/\\s)]+\\/blob\\/[^/\\s)]+\\/rules\\/([^)]*)\\)`, "g"),
    (_match, target) => `](./rules/${target})`,
  );
}

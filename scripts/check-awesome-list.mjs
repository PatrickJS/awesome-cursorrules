#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { githubBlobPrefix, githubRawPrefix } from "./repo-config.mjs";

const args = parseArgs(process.argv.slice(2));
const root = resolve(args.root ?? process.cwd());
const failures = [];
const selfRepositoryBlobPrefix = githubBlobPrefix();
const selfRepositoryRawPrefix = githubRawPrefix();

checkReadme();

if (failures.length > 0) {
  console.error("Awesome list check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Awesome list check passed.");

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--root") {
      parsed.root = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function checkReadme() {
  const readmePath = resolve(root, "README.md");
  if (!existsSync(readmePath)) {
    failures.push("README.md is missing.");
    return;
  }

  const readme = readFileSync(readmePath, "utf8");
  checkReadmeStructure(readme);
  checkEntryDescriptions(readme);
  checkRuleLinks(readme);
}

function checkReadmeStructure(readme) {
  const firstH2 = readme.match(/^##\s+(.+?)\s*$/m);
  if (!firstH2 || firstH2[1] !== "Contents") {
    failures.push("README Contents must be the first top-level section after the title, image, and description.");
  }

  const contents = extractSection(readme, "Contents");
  if (!contents) {
    failures.push("README must include a Contents section.");
  } else {
    for (const forbidden of ["Contributing", "Footnotes"]) {
      const pattern = new RegExp(`\\[[^\\]]*${forbidden}[^\\]]*\\]\\(`, "i");
      if (pattern.test(contents)) {
        failures.push(`README Contents must not include the ${forbidden} section.`);
      }
    }

    checkContentsHierarchy(readme, contents);
  }

  if (/^##\s+Licen[cs]e\b/im.test(readme)) {
    failures.push("README must not include a License/Licence section; keep license details in the root LICENSE file.");
  }

  if (/\bSpringboot\b/i.test(stripLinkTargets(readme))) {
    failures.push("README must spell Spring Boot as two words.");
  }
}

function stripLinkTargets(markdown) {
  return markdown.replace(/\]\([^)]*\)/g, "]()").replace(/\bsrc(set)?=\"[^\"]*\"/g, "");
}

function checkContentsHierarchy(readme, contents) {
  const rules = extractSection(readme, "Rules");
  if (!rules) return;

  const ruleSubheadings = [...rules.matchAll(/^###\s+(.+?)\s*$/gm)].map((match) => match[1].trim());
  const contentLines = contents.split(/\r?\n/);

  for (const heading of ruleSubheadings) {
    const anchor = markdownAnchor(heading);
    const headingPattern = escapeRegExp(heading);
    const anchorPattern = escapeRegExp(anchor);
    const topLevelPattern = new RegExp(`^- \\[${headingPattern}\\]\\(#${anchorPattern}\\)\\s*$`);
    const nestedPattern = new RegExp(`^\\s{2,}- \\[${headingPattern}\\]\\(#${anchorPattern}\\)\\s*$`);

    if (contentLines.some((line) => topLevelPattern.test(line))) {
      failures.push(`README Contents must nest rule category links under Rules: ${heading}.`);
    } else if (!contentLines.some((line) => nestedPattern.test(line))) {
      failures.push(`README Contents must include nested rule category link under Rules: ${heading}.`);
    }
  }
}

function markdownAnchor(heading) {
  return heading
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractSection(markdown, heading) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, "m");
  const match = markdown.match(pattern);
  if (!match || match.index === undefined) return null;

  const start = match.index + match[0].length;
  const nextHeading = markdown.slice(start).match(/\n##\s+/);
  const end = nextHeading?.index === undefined ? markdown.length : start + nextHeading.index;
  return markdown.slice(start, end);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function checkEntryDescriptions(readme) {
  for (const { lineNumber, description } of extractEntries(readme)) {
    if (/^Cursor rules\s+(for|that|to)\b/i.test(description)) {
      failures.push(`README entry description on line ${lineNumber} starts with noisy "Cursor rules ..." phrasing.`);
    }

    if (!/^[A-Z0-9`]/.test(description)) {
      failures.push(`README entry description on line ${lineNumber} must start with an uppercase character.`);
    }

    if (!description.endsWith(".")) {
      failures.push(`README entry description on line ${lineNumber} must end with a period.`);
    }
  }
}

function extractEntries(readme) {
  return readme
    .split(/\r?\n/)
    .map((line, index) => ({ line, lineNumber: index + 1 }))
    .map(({ line, lineNumber }) => {
      const match = line.match(/^\s*-\s+\[[^\]]+\]\([^)]+\)\s+-\s+(.+)$/);
      return match ? { lineNumber, description: match[1].trim() } : null;
    })
    .filter(Boolean);
}

function checkRuleLinks(readme) {
  if (/\]\((\.\/)?rules\//.test(readme)) {
    failures.push("README rule links must use canonical GitHub URLs so external awesome-list tooling can resolve them.");
  }

  for (const link of extractMarkdownLinks(readme)) {
    const target = link.split("#")[0].trim();
    if (!target) continue;

    const localTarget = toLocalTarget(target);
    if (localTarget === null) continue;

    const resolved = resolve(root, localTarget);
    if (!existsSync(resolved)) {
      failures.push(`README local link is missing: ${target}`);
    }
  }
}

function extractMarkdownLinks(text) {
  const links = [];
  const pattern = /(?<!!)\[[^\]]+\]\(([^)\s]+(?:\s+"[^"]*")?)\)/g;
  for (const match of text.matchAll(pattern)) {
    links.push(match[1].replace(/\s+".*"$/, ""));
  }
  return links;
}

function toLocalTarget(target) {
  const cleanTarget = decodeURIComponent(target.replace(/^<|>$/g, ""));

  if (cleanTarget.startsWith(selfRepositoryBlobPrefix)) {
    return cleanTarget.slice(selfRepositoryBlobPrefix.length);
  }

  if (cleanTarget.startsWith(selfRepositoryRawPrefix)) {
    return cleanTarget.slice(selfRepositoryRawPrefix.length);
  }

  if (/^(https?:|mailto:|#)/i.test(cleanTarget)) {
    return null;
  }

  return cleanTarget;
}

#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, normalize, resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));
const root = resolve(args.root ?? process.cwd());
const changedFiles = args.changedFiles
  ? readLines(resolve(root, args.changedFiles))
  : null;
const diffText = args.diffFile ? readOptional(resolve(root, args.diffFile)) : "";
const failures = [];

const filesToCheck = changedFiles ?? listFiles(root);

if (!changedFiles || changedFiles.includes("README.md")) {
  checkReadmeLinks();
}

checkIssueTemplateGuardrails();
checkRuleFiles(filesToCheck);
checkReadmeOnlyExternalListings(changedFiles, diffText);

if (failures.length > 0) {
  console.error("Repo hygiene check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Repo hygiene check passed.");

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--root") {
      parsed.root = argv[++i];
    } else if (arg === "--changed-files") {
      parsed.changedFiles = argv[++i];
    } else if (arg === "--diff-file") {
      parsed.diffFile = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return parsed;
}

function readLines(filePath) {
  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function readOptional(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
}

function listFiles(startDir) {
  const results = [];
  const ignored = new Set([".git", "node_modules"]);

  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        results.push(relativeToRoot(fullPath));
      }
    }
  }

  walk(startDir);
  return results;
}

function relativeToRoot(filePath) {
  return normalize(filePath).slice(normalize(root).length + 1);
}

function checkReadmeLinks() {
  const readmePath = join(root, "README.md");
  if (!existsSync(readmePath)) return;

  const readme = readFileSync(readmePath, "utf8");
  const links = extractMarkdownLinks(readme);

  for (const link of links) {
    const target = link.split("#")[0].trim();
    if (!target || isExternalOrAnchor(target)) continue;

    const cleanTarget = decodeURIComponent(target.replace(/^<|>$/g, ""));
    const resolved = resolve(root, cleanTarget);
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

function isExternalOrAnchor(target) {
  return /^(https?:|mailto:|#)/i.test(target);
}

function checkRuleFiles(candidateFiles) {
  for (const file of candidateFiles) {
    if (!isRuleFile(file)) continue;

    const fullPath = join(root, file);
    if (!existsSync(fullPath) || !statSync(fullPath).isFile()) continue;

    const content = readFileSync(fullPath, "utf8");
    const trimmed = content.trim();

    if (trimmed.length === 0) {
      failures.push(`${file} is empty.`);
      continue;
    }

    if (looksLikeAiErrorMessage(trimmed)) {
      failures.push(`${file} looks like an AI error message, not rule content.`);
    }

    if (isRulesNewMdc(file)) {
      checkRulesNewFrontmatter(file, trimmed);
    }
  }
}

function checkIssueTemplateGuardrails() {
  const githubDir = join(root, ".github");
  if (!existsSync(githubDir) || !statSync(githubDir).isDirectory()) return;

  const issueTemplateDir = join(githubDir, "ISSUE_TEMPLATE");
  const configPath = join(issueTemplateDir, "config.yml");

  if (!existsSync(configPath)) {
    failures.push("Issue templates must disable blank issues with .github/ISSUE_TEMPLATE/config.yml.");
    return;
  }

  const config = readFileSync(configPath, "utf8");
  if (!/^blank_issues_enabled:\s*false\s*$/m.test(config)) {
    failures.push("Issue templates must disable blank issues with `blank_issues_enabled: false`.");
  }

  const issueForms = listIssueForms(issueTemplateDir);
  if (issueForms.length === 0) {
    failures.push("Issue templates must include at least one issue form.");
  }

  for (const form of issueForms) {
    const content = readFileSync(join(issueTemplateDir, form), "utf8");
    if (!hasOutOfScopeSupportAcknowledgement(content)) {
      failures.push(
        `.github/ISSUE_TEMPLATE/${form} must require the out-of-scope support acknowledgement for third-party tool support, account sharing, and license bypass help.`,
      );
    }
  }
}

function listIssueForms(issueTemplateDir) {
  if (!existsSync(issueTemplateDir) || !statSync(issueTemplateDir).isDirectory()) {
    return [];
  }

  return readdirSync(issueTemplateDir)
    .filter((entry) => /^.+\.ya?ml$/i.test(entry))
    .filter((entry) => entry.toLowerCase() !== "config.yml");
}

function hasOutOfScopeSupportAcknowledgement(content) {
  return /-\s*label:\s*.*\bthird-party tool support\b.*\baccount sharing\b.*\blicense bypass\b.*\n\s*required:\s*true\b/i.test(
    content,
  );
}

function isRuleFile(file) {
  if (!file.startsWith("rules/") && !file.startsWith("rules-new/")) {
    return false;
  }
  if (/\/README\.md$/i.test(file)) return false;
  return /(\.cursorrules(?:\..*)?|\.mdc|\.mdx)$/i.test(file);
}

function looksLikeAiErrorMessage(content) {
  const firstLine = content.split(/\r?\n/, 1)[0];
  return /\bI'm sorry\b/i.test(firstLine) && /(forgot|unable|cannot|can't|seems like)/i.test(firstLine);
}

function isRulesNewMdc(file) {
  return file.startsWith("rules-new/") && file.endsWith(".mdc");
}

function checkRulesNewFrontmatter(file, content) {
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    failures.push(`${file} is missing YAML frontmatter.`);
    return;
  }

  for (const field of ["description", "globs", "alwaysApply"]) {
    const pattern = new RegExp(`^${field}\\s*:`, "m");
    if (!pattern.test(frontmatter)) {
      failures.push(`${file} is missing frontmatter field \`${field}\`.`);
    }
  }
}

function parseFrontmatter(content) {
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    return null;
  }

  const normalized = content.replace(/\r\n/g, "\n");
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return null;
  return normalized.slice(4, end);
}

function checkReadmeOnlyExternalListings(files, diff) {
  if (!files || !diff || !files.includes("README.md")) return;

  const changesRuleContent = files.some((file) => file.startsWith("rules/") || file.startsWith("rules-new/"));
  if (changesRuleContent) return;

  const addedExternalListings = diff
    .split(/\r?\n/)
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .filter((line) => /^\+\s*-\s*\[[^\]]+\]\(https?:\/\//i.test(line));

  for (const line of addedExternalListings) {
    failures.push(
      `README-only external listing needs accompanying rule content or maintainer discussion: ${line.slice(1).trim()}`,
    );
  }
}

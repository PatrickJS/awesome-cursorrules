#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, normalize, resolve } from "node:path";
import { githubBlobPrefix, githubRawPrefix } from "./repo-config.mjs";

const args = parseArgs(process.argv.slice(2));
const root = resolve(args.root ?? process.cwd());
const changedFiles = args.changedFiles
  ? readLines(resolve(root, args.changedFiles))
  : null;
const diffText = args.diffFile ? readOptional(resolve(root, args.diffFile)) : "";
const failures = [];
const selfRepositoryBlobPrefix = githubBlobPrefix();
const selfRepositoryRawPrefix = githubRawPrefix();
const requiredRuleFrontmatterFields = ["description", "globs", "alwaysApply"];
const ruleFrontmatterExample = [
  "---",
  "description: One-line summary of what this rule helps Cursor do",
  "globs: **/*.ts, **/*.tsx",
  "alwaysApply: false",
  "---",
].join("\n");

const filesToCheck = changedFiles ?? listFiles(root);

if (!changedFiles || changedFiles.includes("README.md")) {
  checkReadme();
}

checkIssueTemplateGuardrails();
checkRuleFiles(filesToCheck);
checkPromptSafety(filesToCheck);
checkReadmeOnlyExternalListings(changedFiles, diffText);

if (failures.length > 0) {
  console.error("Repo hygiene check failed:\n");
  for (const failure of failures) {
    console.error(formatFailure(failure));
    console.error("");
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

function addFailure({ ruleId, title, file, problem, why, fix }) {
  for (const [field, value] of Object.entries({ ruleId, title, file, problem, why, fix })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Invalid repo hygiene failure: missing ${field}.`);
    }
  }

  failures.push({ ruleId, title, file, problem, why, fix });
}

function formatFailure(failure) {
  return [
    `Rule: ${failure.ruleId} - ${failure.title}`,
    `File: ${failure.file}`,
    `Problem: ${failure.problem}`,
    `Why it matters: ${failure.why}`,
    `Fix: ${failure.fix}`,
  ].join("\n");
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

function checkReadme() {
  const readmePath = join(root, "README.md");
  if (!existsSync(readmePath)) return;

  const readme = readFileSync(readmePath, "utf8");
  checkReadmeSections(readme);
  checkReadmeLinks(readme);
}

function checkReadmeSections(readme) {
  const bannedSections = [
    { name: "Other", article: "an" },
    { name: "Utilities", article: "a" },
  ];

  for (const section of bannedSections) {
    const pattern = new RegExp(`^###\\s+${section.name}\\s*$`, "m");
    if (pattern.test(readme)) {
      addFailure({
        ruleId: "readme/no-catch-all-section",
        title: "README categories must be specific",
        file: "README.md",
        problem: `README must not include ${section.article} ${section.name} section.`,
        why: "Catch-all sections attract low-signal listings and make it harder for maintainers to review whether a rule belongs in a concrete category.",
        fix: "Move reusable rule content into the most specific existing category, or create a specific category only when the README taxonomy clearly needs one.",
      });
    }
  }
}

function checkReadmeLinks(readme) {
  const links = extractMarkdownLinks(readme);

  for (const link of links) {
    const target = link.split("#")[0].trim();
    if (!target || isExternalOrAnchor(target)) continue;

    const cleanTarget = decodeURIComponent(target.replace(/^<|>$/g, ""));
    const resolved = resolve(root, cleanTarget);
    if (!existsSync(resolved)) {
      addFailure({
        ruleId: "readme/no-missing-local-link",
        title: "README local links must resolve",
        file: "README.md",
        problem: `README local link is missing: ${target}`,
        why: "Broken local links create dead catalog entries and hide missing or misnamed rule files during PR review.",
        fix: "Create the linked file, correct the link target, or remove the README entry if the rule file is not part of this PR.",
      });
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
      addFailure({
        ruleId: "rule-content/no-empty-file",
        title: "Rule files must contain content",
        file,
        problem: `${file} is empty.`,
        why: "Empty rule files pass path-level checks but provide no useful prompt content for Cursor users.",
        fix: "Add complete rule content with valid frontmatter, or remove the empty file from the PR.",
      });
      continue;
    }

    if (looksLikeAiErrorMessage(trimmed)) {
      addFailure({
        ruleId: "rule-content/no-ai-placeholder",
        title: "Rule files must not be AI error placeholders",
        file,
        problem: `${file} looks like an AI error message, not rule content.`,
        why: "AI apology or placeholder text usually means generation failed and the rule was committed without reviewable content.",
        fix: "Replace the placeholder with real rule content, or remove the file until the rule is ready.",
      });
    }

    if (isCanonicalMdcRule(file)) {
      checkRuleFrontmatter(file, trimmed);
    }
  }
}

function checkPromptSafety(candidateFiles) {
  for (const file of candidateFiles) {
    const normalizedFile = toPosixPath(file);
    if (!isPromptSafetyFile(normalizedFile)) continue;

    const fullPath = join(root, normalizedFile);
    if (!existsSync(fullPath) || !statSync(fullPath).isFile()) continue;

    const content = readFileSync(fullPath, "utf8");
    checkPromptUnicode(normalizedFile, content);
    checkPromptUnsafeDeveloperCommands(normalizedFile, content);

    if (isAgentInstructionFile(normalizedFile)) {
      checkAgentInstructionExfiltration(normalizedFile, content);
    }
  }
}

function checkIssueTemplateGuardrails() {
  const githubDir = join(root, ".github");
  if (!existsSync(githubDir) || !statSync(githubDir).isDirectory()) return;

  const issueTemplateDir = join(githubDir, "ISSUE_TEMPLATE");
  const configPath = join(issueTemplateDir, "config.yml");

  if (!existsSync(configPath)) {
    addFailure({
      ruleId: "issue-template/blank-issues-config-required",
      title: "Issue templates must configure blank issues",
      file: ".github/ISSUE_TEMPLATE/config.yml",
      problem: "Issue templates must disable blank issues with .github/ISSUE_TEMPLATE/config.yml.",
      why: "Blank issues bypass the repo's structured request guardrails for spam, support requests, account sharing, and license bypass help.",
      fix: "Add .github/ISSUE_TEMPLATE/config.yml with `blank_issues_enabled: false`.",
    });
    return;
  }

  const config = readFileSync(configPath, "utf8");
  if (!/^blank_issues_enabled:\s*false\s*$/m.test(config)) {
    addFailure({
      ruleId: "issue-template/no-blank-issues",
      title: "Blank issues must be disabled",
      file: ".github/ISSUE_TEMPLATE/config.yml",
      problem: "Issue templates must disable blank issues with `blank_issues_enabled: false`.",
      why: "Blank issues bypass the required acknowledgements that keep the repo focused on reusable rule contributions.",
      fix: "Set `blank_issues_enabled: false` in .github/ISSUE_TEMPLATE/config.yml.",
    });
  }

  const issueForms = listIssueForms(issueTemplateDir);
  if (issueForms.length === 0) {
    addFailure({
      ruleId: "issue-template/form-required",
      title: "At least one issue form is required",
      file: ".github/ISSUE_TEMPLATE",
      problem: "Issue templates must include at least one issue form.",
      why: "With blank issues disabled, at least one issue form is needed so legitimate contributors can still open structured requests.",
      fix: "Add a .yml issue form under .github/ISSUE_TEMPLATE/.",
    });
  }

  for (const form of issueForms) {
    const content = readFileSync(join(issueTemplateDir, form), "utf8");
    if (!hasOutOfScopeSupportAcknowledgement(content)) {
      addFailure({
        ruleId: "issue-template/out-of-scope-ack-required",
        title: "Issue forms must include the out-of-scope acknowledgement",
        file: `.github/ISSUE_TEMPLATE/${form}`,
        problem: `.github/ISSUE_TEMPLATE/${form} must require the out-of-scope support acknowledgement for third-party tool support, account sharing, and license bypass help.`,
        why: "The acknowledgement makes the repo policy explicit before users submit requests that maintainers will not handle.",
        fix: "Add a required checkbox that says the requester is not asking for third-party tool support, account sharing, or license bypass help.",
      });
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
  if (!file.startsWith("rules/")) {
    return false;
  }
  if (/\/README\.md$/i.test(file)) return false;
  return /\.mdc$/i.test(file);
}

function looksLikeAiErrorMessage(content) {
  const firstLine = content.split(/\r?\n/, 1)[0];
  return /\bI'm sorry\b/i.test(firstLine) && /(forgot|unable|cannot|can't|seems like)/i.test(firstLine);
}

function isCanonicalMdcRule(file) {
  return file.startsWith("rules/") && file.endsWith(".mdc");
}

function isPromptSafetyFile(file) {
  if (isCanonicalMdcRule(file)) return true;
  if (/^\.cursor\/rules\/.+\.mdc$/i.test(file)) return true;
  return isAgentInstructionFile(file);
}

function isAgentInstructionFile(file) {
  const lowerFile = file.toLowerCase();
  const name = lowerFile.split("/").pop();

  if ([".cursorrules", ".clinerules", ".windsurfrules"].includes(name)) {
    return true;
  }

  if (/^(agents|claude|codex|cursor|gemini)(\..+)?\.md$/.test(name)) {
    return true;
  }

  return (
    lowerFile === ".github/copilot-instructions.md" ||
    /\.github\/instructions\/.+\.instructions\.md$/.test(lowerFile)
  );
}

function checkPromptUnicode(file, content) {
  let line = 1;
  let column = 1;

  for (const char of content) {
    const codePoint = char.codePointAt(0);
    const classification = classifyPromptCodePoint(codePoint);

    if (classification) {
      addFailure({
        ruleId: "prompt/no-hidden-or-control-unicode",
        title: "Prompt files must not contain hidden Unicode controls",
        file,
        problem: `${file} contains disallowed ${classification} ${formatCodePoint(codePoint)} at ${line}:${column}. AI prompt files must not contain invisible Unicode, bidirectional overrides, or terminal control characters.`,
        why: "Hidden Unicode and terminal controls can conceal prompt-injection text or make review output misleading.",
        fix: "Remove the disallowed character and keep prompt text visible ASCII or ordinary visible Unicode only.",
      });
    }

    if (char === "\n") {
      line += 1;
      column = 1;
    } else if (char === "\r") {
      column = 1;
    } else {
      column += 1;
    }
  }
}

function classifyPromptCodePoint(codePoint) {
  if (isBidirectionalTextControl(codePoint)) {
    return "bidirectional text control";
  }

  if (isDisallowedControlCharacter(codePoint)) {
    return "control character";
  }

  if (isInvisibleUnicode(codePoint)) {
    return "invisible Unicode";
  }

  return null;
}

function isBidirectionalTextControl(codePoint) {
  return (
    codePoint === 0x061c ||
    codePoint === 0x200e ||
    codePoint === 0x200f ||
    inRange(codePoint, 0x202a, 0x202e) ||
    inRange(codePoint, 0x2066, 0x2069)
  );
}

function isDisallowedControlCharacter(codePoint) {
  if (codePoint === 0x09 || codePoint === 0x0a || codePoint === 0x0d) {
    return false;
  }

  return inRange(codePoint, 0x0000, 0x001f) || inRange(codePoint, 0x007f, 0x009f);
}

function isInvisibleUnicode(codePoint) {
  return (
    codePoint === 0x00ad ||
    codePoint === 0x034f ||
    inRange(codePoint, 0x115f, 0x1160) ||
    inRange(codePoint, 0x17b4, 0x17b5) ||
    codePoint === 0x180e ||
    inRange(codePoint, 0x200b, 0x200d) ||
    inRange(codePoint, 0x2060, 0x2064) ||
    inRange(codePoint, 0x206a, 0x206f) ||
    codePoint === 0x2800 ||
    codePoint === 0x3164 ||
    inRange(codePoint, 0xfe00, 0xfe0f) ||
    codePoint === 0xfeff ||
    codePoint === 0xffa0 ||
    inRange(codePoint, 0xe0000, 0xe007f) ||
    inRange(codePoint, 0xe0100, 0xe01ef)
  );
}

function checkAgentInstructionExfiltration(file, content) {
  if (!hasNetworkEgressPattern(content) || !hasSensitiveCredentialPattern(content)) {
    return;
  }

  addFailure({
    ruleId: "prompt/no-credential-exfiltration",
    title: "Prompt files must not combine secrets with outbound network commands",
    file,
    problem: `${file} contains a suspicious credential exfiltration instruction: network command references sensitive credential material.`,
    why: "A prompt that combines credential material with network egress can cause an AI agent to leak local secrets during normal task execution.",
    fix: "Remove commands that combine outbound requests with SSH keys, package tokens, cloud credentials, crypto wallets, or environment dumps.",
  });
}

function hasNetworkEgressPattern(content) {
  return /\b(?:curl|wget|nc|ncat|netcat|scp|sftp|ftp)\b|(?:fetch|XMLHttpRequest)\s*\(|\bInvoke-WebRequest\b|\biwr\b|https?:\/\//i.test(
    content,
  );
}

function hasSensitiveCredentialPattern(content) {
  const sensitiveCredentialPattern =
    /(?:^|[^\w])(?:~\/)?\.ssh\/(?:id_rsa|id_ed25519|config)|(?:^|[^\w])(?:~\/)?\.aws\/(?:credentials|config)|(?:^|[^\w])(?:~\/)?\.config\/gh|(?:^|[^\w])\.npmrc\b|(?:^|[^\w])\.pypirc\b|cargo\/credentials|wallet\.dat|(?:^|[^\w])\.env\b|\bprocess\.env\b|\bprintenv\b|\bgh auth token\b|ssh[_ -]?key|private[_ -]?key|api[_ -]?key|access[_ -]?token|secret[_ -]?key|mnemonic|seed phrase/i;

  return sensitiveCredentialPattern.test(content);
}

function checkPromptUnsafeDeveloperCommands(file, content) {
  const unsafeCommandChecks = [
    {
      ruleId: "prompt/no-secret-read-command",
      title: "Prompt rules must not read local secrets",
      pattern:
        /\bcat\s+[^\n`]*(?:(?:~|\$HOME)\/(?:\.ssh\/(?:id_rsa|id_ed25519|config)|\.aws\/credentials|\.config\/gh\/hosts\.yml|\.npmrc|\.pypirc)|(?:^|[^\w/.-])(?:\.env(?!\.(?:example|sample|template)\b)|\.npmrc|\.pypirc|wallet\.dat)\b)|\bgh\s+auth\s+token\b|\bsecurity\s+find-(?:generic|internet)-password\b|\baws\s+configure\s+export-credentials\b|\bgcloud\s+auth\s+print-access-token\b|\baz\s+account\s+get-access-token\b/i,
      problem: "local secret read command.",
      why: "Prompt rules that tell agents to print SSH keys, cloud credentials, GitHub tokens, keychain passwords, or access tokens can leak credentials into logs, chats, or network requests.",
      fix: "Remove commands that read local credential stores or print tokens; ask the user to verify credentials through the provider UI or a redacted status command instead.",
    },
    {
      ruleId: "prompt/no-remote-bootstrap",
      title: "Prompt rules must not pipe remote code into an interpreter",
      pattern:
        /\b(?:curl|wget)\b[^\n`|;]*(?:\|\s*(?:sudo\s+)?(?:sh|bash|zsh)\b)|\b(?:sh|bash|zsh)\s+<\(\s*(?:curl|wget)\b|\b(?:eval|source)\s+["']?\$\(\s*(?:curl|wget)\b|\bbase64\b[^\n`|;]*(?:-d|--decode)[^\n`|;]*\|\s*(?:sh|bash|zsh)\b/i,
      problem: "remote bootstrap execution command.",
      why: "Downloading code and immediately executing it hides the reviewed payload from maintainers and can turn a rule file into a supply-chain bootstrap path.",
      fix: "Replace remote pipe-to-shell, eval, process substitution, or decoded shell bootstraps with instructions to inspect, pin, and run trusted project-local scripts.",
    },
    {
      ruleId: "prompt/no-persistence-hook",
      title: "Prompt rules must not install persistent hooks",
      pattern:
        /\blaunchctl\s+(?:load|bootstrap|enable)\b|(?:~|\$HOME)\/Library\/LaunchAgents\/|\/Library\/LaunchDaemons\/|\bcrontab\s+(?:-e|-r|-l\s*\|)|(?:>>|>|tee\s+-a)\s*(?:~|\$HOME)\/\.(?:zshrc|bashrc|bash_profile|profile|config\/fish\/config\.fish)\b/i,
      problem: "persistent user or system hook.",
      why: "Shell profile edits, launch agents, launch daemons, and cron changes can keep running after the task ends and silently affect future developer sessions.",
      fix: "Do not tell agents to add persistence. Use explicit one-shot project-local commands and ask the user before changing login items, shell profiles, cron, or launch services.",
    },
    {
      ruleId: "prompt/no-lifecycle-hook",
      title: "Prompt rules must not add package or Git lifecycle hooks",
      pattern:
        /["'](?:preinstall|postinstall|prepare)["']\s*:|\bnpm\s+(?:pkg\s+set\s+scripts\.(?:preinstall|postinstall|prepare)|set-script\s+(?:preinstall|postinstall|prepare))\b|\b(?:pnpm|yarn)\s+pkg\s+set\s+scripts\.(?:preinstall|postinstall|prepare)\b|\.git\/hooks\/(?:pre-commit|post-commit|pre-push|commit-msg|prepare-commit-msg|post-checkout|post-merge|post-rewrite|pre-rebase)\b/i,
      problem: "package or Git lifecycle hook.",
      why: "Package lifecycle scripts and Git hooks can execute automatically during install, commit, checkout, or merge operations without the user re-reading the rule.",
      fix: "Remove instructions that create lifecycle hooks; prefer explicit commands that the user runs intentionally inside the project.",
    },
    {
      ruleId: "prompt/no-security-control-disable",
      title: "Prompt rules must not disable security controls",
      pattern:
        /\bspctl\s+--master-disable\b|\bcsrutil\s+(?:disable|authenticated-root\s+disable)\b|\bufw\s+disable\b|\bsystemctl\s+(?:stop|disable)\s+(?:firewalld|iptables|nftables|auditd)\b|\biptables\s+-F\b|\bsetenforce\s+0\b/i,
      problem: "security control disabling command.",
      why: "Disabling Gatekeeper, SIP, firewalls, audit services, or mandatory access controls weakens the host beyond the immediate rule task.",
      fix: "Do not instruct agents to disable security controls. Use narrow diagnostics or documented allowlisting steps that preserve the control boundary.",
    },
    {
      ruleId: "prompt/no-config-disclosure",
      title: "Prompt rules must not dump local configuration",
      pattern:
        /(?:\becho\s+\$(?:HTTP_PROXY|HTTPS_PROXY|ALL_PROXY)(?:\s+\$(?:HTTP_PROXY|HTTPS_PROXY|ALL_PROXY))*|\$env:(?:HTTP_PROXY|HTTPS_PROXY|ALL_PROXY)(?:\s*;\s*\$env:(?:HTTP_PROXY|HTTPS_PROXY|ALL_PROXY))+|\b(?:npm|pnpm|yarn|pip)\s+config\s+list\b|\bgit\s+config\s+--list\b|\bdocker\s+info\b[\s\S]{0,120}\b(?:registry|proxy)\b)/i,
      problem: "unsafe diagnostic secret or configuration disclosure command.",
      why: "Proxy environment variables and package, Git, or Docker config can contain credentials or private infrastructure details that may be copied into logs or chat.",
      fix: "Prompt rules must not instruct agents to print proxy environment variables or dump npm, pip, git, or Docker config because logs may expose credentials.",
    },
    {
      ruleId: "prompt/no-tls-bypass",
      title: "Prompt rules must not normalize TLS verification bypasses",
      pattern:
        /\b(?:Invoke-WebRequest|iwr)\b[^\n`]*\s-SkipCertificateCheck\b|\bServerCertificateValidationCallback\s*=[^\n]*(?:\{\s*\$?true\s*\}|=>\s*\$?true)|\bcurl\b[^\n`]*(?:\s-k\b|\s--insecure\b)|\bNODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0\b|\b(?:npm|pnpm|yarn)\s+config\s+set\s+strict-ssl\s+false\b|\bgit\s+config\s+--global\s+http\.sslVerify\s+false\b/i,
      problem: "unsafe TLS verification bypass.",
      why: "Disabling certificate validation makes man-in-the-middle attacks and unsafe package/network access easier to miss.",
      fix: "Prompt rules must not normalize disabling certificate validation; use certificate inspection commands that keep verification intact.",
    },
    {
      ruleId: "prompt/no-persistent-network-config",
      title: "Prompt rules must not mutate persistent developer network settings",
      pattern:
        /\b(?:npm|pnpm|yarn)\s+config\s+set\s+(?:registry|proxy|https-proxy|strict-ssl)\b|\bpip\s+config\s+set\s+(?:global\.)?(?:index-url|trusted-host|cert|client-cert|proxy)\b|\bgit\s+config\s+--global\b|\bexport\s+(?:HTTP_PROXY|HTTPS_PROXY|ALL_PROXY)=|\$env:(?:HTTP_PROXY|HTTPS_PROXY|ALL_PROXY)\s*=/i,
      problem: "unsafe persistent developer configuration mutation.",
      why: "Global registry, proxy, or trust changes can silently reroute future installs and Git traffic after the immediate task ends.",
      fix: "Prompt rules must not tell agents to reroute package managers, Git, or proxy settings globally or to trust alternate package hosts.",
    },
    {
      ruleId: "prompt/no-hardcoded-public-network-probe",
      title: "Prompt rules must not probe unrelated public services by default",
      pattern:
        /\b(?:8\.8\.8\.8|8\.8\.4\.4|1\.1\.1\.1|1\.0\.0\.1)\b|https?:\/\/(?:www\.)?google\.com(?:[^\w.-]|$)/i,
      problem: "hardcoded public network probe.",
      why: "Unrelated public probes can leak local network context and may violate user, corporate, or regional network policy.",
      fix: "Prompt rules must ask for a user-provided target or explicit approval before probing unrelated public services.",
    },
  ];

  for (const check of unsafeCommandChecks) {
    if (!check.pattern.test(content)) continue;

    addFailure({
      ruleId: check.ruleId,
      title: check.title,
      file,
      problem: `${file} contains ${check.problem}`,
      why: check.why,
      fix: check.fix,
    });
  }
}

function formatCodePoint(codePoint) {
  return `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
}

function inRange(value, min, max) {
  return value >= min && value <= max;
}

function checkRuleFrontmatter(file, content) {
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    addFailure({
      ruleId: "rule-frontmatter/required",
      title: "Rule files must start with YAML frontmatter",
      file,
      problem: `${file} is missing YAML frontmatter. rules/*.mdc files must begin with YAML frontmatter that includes \`description\`, \`globs\`, and \`alwaysApply\` (true/false).`,
      why: "Frontmatter gives Cursor and reviewers a predictable rule summary, scope, and apply behavior.",
      fix: `Copy this example and adjust the values:\n${ruleFrontmatterExample}`,
    });
    return;
  }

  const fields = {};
  for (const field of requiredRuleFrontmatterFields) {
    const value = readFrontmatterField(frontmatter, field);
    if (value === null) {
      addFailure({
        ruleId: "rule-frontmatter/field-required",
        title: "Rule frontmatter must include all required fields",
        file,
        problem: `${file} is missing required YAML frontmatter field \`${field}\`. Required fields for rules/*.mdc: \`description\`, \`globs\`, \`alwaysApply\`.`,
        why: "Missing frontmatter fields make rule scope and application behavior ambiguous for both maintainers and AI tooling.",
        fix: "Add `description`, `globs`, and `alwaysApply`. Add `alwaysApply: false` for scoped rules, and `alwaysApply: true` only for rules that should always apply.",
      });
      continue;
    }
    fields[field] = value;
  }

  if (fields.description !== undefined && stripYamlQuotes(fields.description).trim().length === 0) {
    addFailure({
      ruleId: "rule-frontmatter/description-required",
      title: "Rule descriptions must be non-empty",
      file,
      problem: `${file} frontmatter field \`description\` is empty.`,
      why: "The description is the quickest human and agent signal for what the rule is supposed to help Cursor do.",
      fix: "Add a short explanation of what the rule helps Cursor do.",
    });
  }

  if (fields.alwaysApply !== undefined && !["true", "false"].includes(fields.alwaysApply)) {
    addFailure({
      ruleId: "rule-frontmatter/always-apply-boolean",
      title: "Rule alwaysApply must be boolean text",
      file,
      problem: `${file} frontmatter field \`alwaysApply\` must be exactly \`true\` or \`false\`.`,
      why: "Cursor rule application needs an unambiguous true/false value; values like `maybe` are not actionable.",
      fix: "Use `alwaysApply: false` for scoped rules, or `alwaysApply: true` only for rules that should always apply.",
    });
  }

  if (
    fields.globs !== undefined &&
    stripYamlQuotes(fields.globs).trim().length === 0 &&
    fields.alwaysApply !== "true"
  ) {
    addFailure({
      ruleId: "rule-frontmatter/globs-required",
      title: "Scoped rules must declare globs",
      file,
      problem: `${file} frontmatter field \`globs\` is empty.`,
      why: "A scoped rule without globs does not say which files it applies to, which makes rule behavior unclear.",
      fix: "Add file patterns such as `**/*.ts` or use `alwaysApply: true` only for universal rules.",
    });
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

function readFrontmatterField(frontmatter, field) {
  const pattern = new RegExp(`^${field}\\s*:(.*)$`);
  const lines = frontmatter.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(pattern);
    if (!match) continue;

    const values = [match[1].trim()];
    for (const line of lines.slice(index + 1)) {
      if (!/^\s+/.test(line)) break;
      const trimmed = line.trim();
      if (trimmed.length > 0) values.push(trimmed);
    }

    return values.filter(Boolean).join(" ");
  }

  return null;
}

function stripYamlQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function toPosixPath(file) {
  return file.split("\\").join("/");
}

function checkReadmeOnlyExternalListings(files, diff) {
  if (!files || !diff || !files.includes("README.md")) return;

  const addedExternalListings = diff
    .split(/\r?\n/)
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .filter((line) => /^\+\s*-\s*\[[^\]]+\]\(https?:\/\//i.test(line))
    .filter((line) => !isSelfRepositoryListing(line));

  for (const line of addedExternalListings) {
    addFailure({
      ruleId: "readme/no-contributor-external-listing",
      title: "Contributor PRs must not add external primary README listings",
      file: "README.md",
      problem: `New external README listing blocked: ${line.slice(1).trim()}`,
      why: "External primary README listings are maintainer-curated to reduce spam, prompt-injection, promotional, and other abuse risk.",
      fix: "Contributor fix: remove this README bullet from the PR. If the PR adds a useful rule file, keep the rule file and let maintainers decide whether to add the README listing. Changing the referenced rule file will not resolve this README-listing policy failure.",
    });
  }
}

function isSelfRepositoryListing(line) {
  const target = line.match(/\]\(([^)\s]+)/)?.[1] ?? "";
  return target.startsWith(selfRepositoryBlobPrefix) || target.startsWith(selfRepositoryRawPrefix);
}

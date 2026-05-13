#!/usr/bin/env node

import { existsSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rimraf } from "rimraf";

export const defaultLegacyArtifacts = ["rules-legacy", "rules-new", ".cursorrules"];

export async function cleanupLegacyArtifacts({
  root = process.cwd(),
  artifacts = defaultLegacyArtifacts,
} = {}) {
  const repoRoot = resolve(root);
  const targets = artifacts.map((artifact) => resolveLocalArtifact(repoRoot, artifact));
  const existingTargets = targets.filter(({ resolved }) => existsSync(resolved));

  if (existingTargets.length === 0) {
    return [];
  }

  const removed = existingTargets.map(({ artifact }) => artifact);
  const ok = await rimraf(
    existingTargets.map(({ resolved }) => resolved),
    {
      glob: false,
      preserveRoot: true,
    },
  );

  if (!ok) {
    throw new Error(`Unable to remove all legacy artifacts: ${removed.join(", ")}`);
  }

  return removed;
}

function resolveLocalArtifact(repoRoot, artifact) {
  if (isAbsolute(artifact)) {
    throw new Error(`Refusing to remove non-local artifact: ${artifact}`);
  }

  const resolved = resolve(repoRoot, artifact);
  const localPath = relative(repoRoot, resolved);

  if (localPath === "" || localPath.startsWith("..") || isAbsolute(localPath)) {
    throw new Error(`Refusing to remove non-local artifact: ${artifact}`);
  }

  return { artifact, resolved };
}

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

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const removed = await cleanupLegacyArtifacts(args);
    if (removed.length === 0) {
      console.log("No legacy migration artifacts found.");
    } else {
      console.log(`Removed legacy migration artifacts: ${removed.join(", ")}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

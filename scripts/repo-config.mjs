export const DEFAULT_REPOSITORY = "PatrickJS/awesome-cursorrules";
export const DEFAULT_BRANCH = "main";

export const GITHUB_ORIGIN = "https://github.com";
export const RAW_GITHUB_ORIGIN = "https://raw.githubusercontent.com";

export function githubBlobPrefix(repository = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH) {
  return `${GITHUB_ORIGIN}/${repository}/blob/${branch}/`;
}

export function githubRawPrefix(repository = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH) {
  return `${RAW_GITHUB_ORIGIN}/${repository}/${branch}/`;
}

export function githubRulesPrefix(repository = DEFAULT_REPOSITORY, branch = DEFAULT_BRANCH) {
  return `${githubBlobPrefix(repository, branch)}rules/`;
}

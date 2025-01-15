# Installation Guide

## Installing from GitHub Packages

To install this package from GitHub Packages, you'll need to configure npm to authenticate with GitHub. Follow these steps:

### 1. Create a GitHub Personal Access Token (PAT)

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name it something like "npm-packages"
4. Select the `read:packages` scope
5. Generate and copy the token

### 2. Set Up Environment Variable

```bash
# For macOS/Linux users, add this to your ~/.bashrc, ~/.zshrc, or equivalent
export npm_packages=YOUR_GITHUB_PAT
```
Note: Replace `YOUR_GITHUB_PAT` with the token you created.

### 3. Configure npm

Create or modify `~/.npmrc` in your home directory:

```ini
registry=https://registry.npmjs.org/
@garotm:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${npm_packages}
always-auth=true
```

### 4. Install the Package

```bash
npm install @garotm/cursor-rules-dynamic
```

## Development Setup

If you're planning to contribute or develop locally:

### 1. Clone the Repository

```bash
git clone https://github.com/garotm/awesome-cursorrules-dynamic.git
cd awesome-cursorrules-dynamic
```

### 2. Install Dependencies

```bash
cd vscode-extension
npm install
```

### 3. Build and Test

```bash
npm run compile
npm test
```

### 4. Package the Extension

```bash
npm run package
```

## Troubleshooting

### Common Issues

1. **404 Not Found Error**
   - Make sure your .npmrc is configured correctly
   - Verify the package name and version

2. **401 Unauthorized Error**
   - Check if your PAT is set correctly in the environment
   - Verify the PAT has the correct permissions

3. **Dependencies Not Found**
   - The dual registry setup ensures @garotm packages come from GitHub Packages
   - All other dependencies come from the public npm registry

### Verifying Installation

```bash
# Check installed version
npm list @garotm/cursor-rules-dynamic

# Check package contents
ls node_modules/@garotm/cursor-rules-dynamic
```

## CI/CD Configuration

For reference, the project uses different .npmrc configurations for CI/CD:

```ini
# vscode-extension/.npmrc (for CI/CD)
registry=https://npm.pkg.github.com/
@garotm:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
always-auth=true
```

This configuration is automatically used by GitHub Actions workflows for building and publishing.

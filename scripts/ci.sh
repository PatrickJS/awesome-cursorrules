#!/bin/bash

set -e  # Exit on any error

echo "==> Running CI checks..."

cd vscode-extension

# Install dependencies
echo "==> Installing dependencies..."
npm ci

# Run TypeScript compilation
echo "==> Compiling TypeScript..."
npm run compile

# Run linting
echo "==> Running ESLint..."
npm run lint

# Run unit tests that don't require VSCode GUI
echo "==> Running unit tests..."
SKIP_VSCODE_TESTS=true npm run test:unit

# Build the extension package
echo "==> Building extension package..."
npm run vscode:prepublish

echo "All CI checks completed successfully!" 
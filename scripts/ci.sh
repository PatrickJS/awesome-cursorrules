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

# Run tests with xvfb-run for headless environment
echo "==> Running tests..."
if [ -n "$CI" ]; then
    sudo apt-get install -y xvfb
    xvfb-run -a npm test
else
    npm test
fi

# Build the extension package
echo "==> Building extension package..."
npm run vscode:prepublish

echo "All CI checks completed successfully!" 
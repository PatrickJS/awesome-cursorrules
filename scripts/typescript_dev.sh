#!/usr/bin/env bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print step message
print_step() {
    echo -e "${YELLOW}\n==> $1${NC}"
}

# Check if command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is required but not installed.${NC}"
        exit 1
    fi
}

# Verify required tools
check_command "node"
check_command "npm"

# Change to the vscode-extension directory
cd "$(dirname "$0")/../vscode-extension"

print_step "Cleaning previous builds..."
rm -rf node_modules out coverage

print_step "Installing dependencies..."
npm ci

print_step "Running ESLint..."
npm run lint

print_step "Compiling TypeScript..."
npm run compile

print_step "Running tests..."
npm test

print_step "Generating coverage report..."
npm run test:coverage

print_step "Building extension package..."
npm run vscode:prepublish

echo -e "${GREEN}\nAll checks passed successfully!${NC}"

# Print coverage summary
if [ -f "coverage/lcov-report/index.html" ]; then
    print_step "Coverage Summary:"
    cat coverage/coverage-summary.txt
fi

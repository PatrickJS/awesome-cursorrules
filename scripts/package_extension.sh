#!/bin/bash

# Exit on error
set -e

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
EXTENSION_DIR="$SCRIPT_DIR/../vscode-extension"
ROOT_DIR="$SCRIPT_DIR/.."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔧 Packaging VSCode Extension..."

# Check if we're in the right directory
cd "$EXTENSION_DIR"

# Copy LICENSE file if it doesn't exist
if [ ! -f "LICENSE" ]; then
    echo "📄 Copying LICENSE file..."
    cp "$ROOT_DIR/LICENSE" ./LICENSE
fi

# Install vsce if not already installed
if ! command -v vsce &> /dev/null; then
    echo "📦 Installing vsce..."
    npm install -g @vscode/vsce
fi

# Clean any existing packages
rm -f *.vsix

# Run the packaging
echo "📦 Creating VSIX package..."
vsce package

# Verify package was created
if compgen -G "*.vsix" > /dev/null; then
    echo -e "${GREEN}✅ Package created successfully!${NC}"
    ls -l *.vsix
else
    echo -e "${RED}❌ Failed to create package${NC}"
    exit 1
fi

# Clean up temporary LICENSE file
if [ -f "LICENSE" ]; then
    rm LICENSE
fi 
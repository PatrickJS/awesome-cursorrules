#!/usr/bin/env bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="${PROJECT_ROOT}/.venv"

echo -e "${GREEN}Setting up Python environment...${NC}"

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Create and activate virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}Creating new virtual environment...${NC}"
    python3 -m venv "$VENV_DIR"
elif [ -z "$VIRTUAL_ENV" ]; then
    echo -e "${YELLOW}Virtual environment exists but not activated...${NC}"
fi

# Activate virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo -e "${GREEN}Activating virtual environment...${NC}"
    source "$VENV_DIR/bin/activate"
fi

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
echo "Installing production dependencies..."
pip install -r "${PROJECT_ROOT}/requirements.txt"

echo "Installing development dependencies..."
pip install -r "${PROJECT_ROOT}/requirements-dev.txt"

# Install package in development mode
echo "Installing package in development mode..."
pip install -e "${PROJECT_ROOT}"

echo -e "${GREEN}Running code formatters and linters...${NC}"

# Format with black
echo "Running black..."
black src tests

# Sort imports
echo "Running isort..."
isort src tests

# Type checking
echo "Running mypy..."
mypy src tests

# Run flake8
echo "Running flake8..."
flake8 src tests

# Run pylint
echo "Running pylint..."
pylint src tests

# Run security checks
echo "Running bandit..."
bandit -r src tests -ll

# Run dependency security check
echo "Running safety check..."
safety check

# Run pip-audit
echo "Running pip-audit..."
pip-audit

# Run tests with coverage
echo -e "${GREEN}Running tests with coverage...${NC}"
pytest --cov=src --cov-report=xml --cov-report=html

echo -e "${GREEN}All checks completed successfully!${NC}"

# Generate requirements.txt from current environment
echo -e "${GREEN}Updating requirements files...${NC}"
pip freeze > requirements-lock.txt
echo -e "${GREEN}Generated requirements-lock.txt${NC}" 
"""Code analyzer for cursor rules."""

import ast
import os
from pathlib import Path
from typing import Dict, List, Union

from .rules_manager import RulesManager


class CodeAnalyzer:
    """Analyzes code files against cursor rules."""

    def __init__(self, rules_manager: RulesManager) -> None:
        """Initialize the code analyzer.

        Args:
            rules_manager: The rules manager instance to use for analysis.
        """
        self.rules_manager = rules_manager
        self.violations: Dict[Path, List[str]] = {}

    def analyze_file(self, file_path: Union[str, Path]) -> List[str]:
        """Analyze a single file for rule violations.

        Args:
            file_path: Path to the file to analyze.

        Returns:
            List of rule violations found in the file.

        Raises:
            TypeError: If file_path is not a string or Path object.
            ValueError: If file does not exist or is not readable.
        """
        if not isinstance(file_path, (str, Path)):
            raise TypeError("file_path must be a string or Path object")

        file_path = Path(file_path)
        if not file_path.is_file() or not os.access(str(file_path), os.R_OK):
            raise ValueError(f"File {file_path} does not exist or is not readable")

        violations: List[str] = []
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                tree = ast.parse(f.read())
                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef):
                        decorators = [d.id for d in node.decorator_list if isinstance(d, ast.Name)]
                        if decorators:
                            violations.append(
                                f"Function '{node.name}' uses decorators: {decorators}"
                            )
            except SyntaxError:
                violations.append(f"Could not parse {file_path}: invalid Python syntax")

        self.violations[file_path] = violations
        return violations

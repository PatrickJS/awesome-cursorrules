"""Manages cursor rules for the project."""

from pathlib import Path
from typing import Dict, List


class RulesManager:
    """Manages the loading and application of cursor rules."""

    def __init__(self, rules_file: Path) -> None:
        """Initialize the rules manager.

        Args:
            rules_file: Path to the .cursorrules file.
        """
        self.rules_file = rules_file
        self.current_rules: Dict[str, List[str]] = {}
        self.rules_history: List[Dict[str, List[str]]] = []

    def update_rules(self, new_rules: Dict[str, List[str]]) -> None:
        """Update the current rules and store the previous version in history.

        Args:
            new_rules: The new rules to apply.
        """
        if self.current_rules:
            self.rules_history.append(self.current_rules.copy())
        self.current_rules = new_rules.copy()

    def rollback_rules(self) -> bool:
        """Rollback to the previous version of rules.

        Returns:
            bool: True if rollback was successful, False if no history exists.
        """
        if not self.rules_history:
            return False
        self.current_rules = self.rules_history.pop()
        return True

    def get_rule_history(self) -> List[Dict[str, List[str]]]:
        """Get the history of rule changes.

        Returns:
            List of historical rule sets.
        """
        return self.rules_history.copy()

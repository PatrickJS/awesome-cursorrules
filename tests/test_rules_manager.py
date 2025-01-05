"""Tests for the rules manager module."""

from pathlib import Path

import pytest

from cursor_rules_dynamic.rules_manager import RulesManager


@pytest.fixture
def rules_manager(tmp_path: Path) -> RulesManager:
    """Create a RulesManager instance for testing."""
    rules_file = tmp_path / ".cursorrules"
    rules_file.touch()
    return RulesManager(rules_file)


def test_update_rules(rules_manager: RulesManager) -> None:
    """Test updating rules."""
    # Initial rules
    initial_rules = {"decorator_pattern": ["@property", "@staticmethod"]}
    rules_manager.update_rules(initial_rules)
    assert rules_manager.current_rules == initial_rules
    assert len(rules_manager.rules_history) == 0

    # Update rules
    new_rules = {"decorator_pattern": ["@classmethod", "@abstractmethod"]}
    rules_manager.update_rules(new_rules)
    assert rules_manager.current_rules == new_rules
    assert len(rules_manager.rules_history) == 1
    assert rules_manager.rules_history[0] == initial_rules


def test_rollback_rules(rules_manager: RulesManager) -> None:
    """Test rolling back rules."""
    # Add multiple rule sets
    first_rules = {"decorator_pattern": ["@property"]}
    second_rules = {"decorator_pattern": ["@staticmethod"]}
    third_rules = {"decorator_pattern": ["@classmethod"]}

    rules_manager.update_rules(first_rules)
    rules_manager.update_rules(second_rules)
    rules_manager.update_rules(third_rules)

    # Test rollback
    assert rules_manager.rollback_rules()
    assert rules_manager.current_rules == second_rules
    assert rules_manager.current_rules != third_rules

    # Test history tracking
    assert len(rules_manager.rules_history) == 1
    assert rules_manager.rules_history[0] == first_rules


def test_rule_history(rules_manager: RulesManager) -> None:
    """Test rule history tracking."""
    # Add multiple rule sets
    first_rules = {"decorator_pattern": ["@property"]}
    second_rules = {"decorator_pattern": ["@staticmethod"]}

    rules_manager.update_rules(first_rules)
    rules_manager.update_rules(second_rules)

    # Check history
    history = rules_manager.get_rule_history()
    assert len(history) == 1
    assert history[0] == first_rules


def test_rollback_empty_history() -> None:
    """Test rollback behavior with empty history."""
    manager = RulesManager(rules_file=Path("dummy"))
    assert not manager.rollback_rules()  # Should return False with empty history

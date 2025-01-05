"""Tests for the code analyzer module."""

from pathlib import Path

import pytest

from cursor_rules_dynamic.analyzer import CodeAnalyzer
from cursor_rules_dynamic.rules_manager import RulesManager


@pytest.fixture
def rules_manager(tmp_path: Path) -> RulesManager:
    """Create a RulesManager instance for testing."""
    rules_file = tmp_path / ".cursorrules"
    rules_file.touch()
    return RulesManager(rules_file)


@pytest.fixture
def analyzer(rules_manager: RulesManager) -> CodeAnalyzer:
    """Create a CodeAnalyzer instance for testing."""
    return CodeAnalyzer(rules_manager)


def test_analyze_file_invalid_path(analyzer: CodeAnalyzer) -> None:
    """Test analyzing a file with an invalid path."""
    with pytest.raises(ValueError):
        analyzer.analyze_file("nonexistent_file.py")


def test_analyze_file_with_decorators(analyzer: CodeAnalyzer, tmp_path: Path) -> None:
    """Test analyzing a file containing decorated functions."""
    test_file = tmp_path / "test_decorators.py"
    test_file.write_text(
        """
@decorator1
def func1():
    pass

@decorator2
@decorator3
def func2():
    pass
"""
    )

    violations = analyzer.analyze_file(test_file)
    assert len(violations) == 2
    assert "func1" in violations[0]
    assert "decorator1" in violations[0]
    assert "func2" in violations[1]
    assert all(d in violations[1] for d in ["decorator2", "decorator3"])


def test_analyze_file_invalid_type() -> None:
    """Test that analyzer raises TypeError for invalid path types."""
    analyzer = CodeAnalyzer(rules_manager=RulesManager(Path("dummy")))
    with pytest.raises(TypeError, match="file_path must be a string or Path object"):
        analyzer.analyze_file(123)  # type: ignore


def test_analyze_file_syntax_error(tmp_path: Path) -> None:
    """Test handling of Python files with syntax errors."""
    invalid_file = tmp_path / "invalid.py"
    invalid_file.write_text("def invalid_syntax(:")  # Invalid Python syntax

    analyzer = CodeAnalyzer(rules_manager=RulesManager(Path("dummy")))
    violations = analyzer.analyze_file(invalid_file)
    assert len(violations) == 1
    assert "invalid Python syntax" in violations[0]

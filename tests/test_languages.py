"""Tests for the language detection module."""

from pathlib import Path

from cursor_rules_dynamic.languages import Language, LanguageDetector


def test_detect_python_file() -> None:
    """Test detection of Python files."""
    assert LanguageDetector.detect_language(Path("test.py")) == Language.PYTHON
    assert LanguageDetector.detect_language(Path("test.pyi")) == Language.PYTHON
    assert LanguageDetector.detect_language(Path("test.pyx")) == Language.PYTHON


def test_detect_unknown_file() -> None:
    """Test detection of unknown file types."""
    assert LanguageDetector.detect_language(Path("test.txt")) == Language.UNKNOWN
    assert LanguageDetector.detect_language(Path("test.js")) == Language.UNKNOWN
    assert LanguageDetector.detect_language(Path("test")) == Language.UNKNOWN


def test_supports_language() -> None:
    """Test language support checking."""
    assert LanguageDetector.supports_language(Language.PYTHON) is True
    assert LanguageDetector.supports_language(Language.UNKNOWN) is False


def test_case_insensitive_detection() -> None:
    """Test that file extension detection is case-insensitive."""
    assert LanguageDetector.detect_language(Path("test.PY")) == Language.PYTHON
    assert LanguageDetector.detect_language(Path("test.Py")) == Language.PYTHON
    assert LanguageDetector.detect_language(Path("test.pY")) == Language.PYTHON

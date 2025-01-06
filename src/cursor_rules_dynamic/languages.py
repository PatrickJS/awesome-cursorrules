"""Language detection and handling for cursor rules."""

from enum import Enum
from pathlib import Path
from typing import Set


class Language(Enum):
    """Supported programming languages."""

    PYTHON = "python"
    UNKNOWN = "unknown"


class LanguageDetector:
    """Detects programming languages from file paths."""

    PYTHON_EXTENSIONS: Set[str] = {".py", ".pyi", ".pyx"}

    @classmethod
    def detect_language(cls, file_path: Path) -> Language:
        """Detect the programming language of a file.

        Args:
            file_path: Path to the file to analyze.

        Returns:
            Language: The detected programming language.
        """
        suffix = file_path.suffix.lower()

        if suffix in cls.PYTHON_EXTENSIONS:
            return Language.PYTHON

        return Language.UNKNOWN

    @classmethod
    def supports_language(cls, language: Language) -> bool:
        """Check if a language is supported.

        Args:
            language: The language to check.

        Returns:
            bool: True if the language is supported.
        """
        return language != Language.UNKNOWN

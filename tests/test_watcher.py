"""Tests for the file watcher module."""

from pathlib import Path
from typing import Callable, List

import pytest
from watchdog.events import FileModifiedEvent

from cursor_rules_dynamic.watcher import ProjectWatcher


@pytest.fixture
def callback() -> Callable[[Path], None]:
    """Create a mock callback for testing."""
    calls: List[Path] = []

    def mock_callback(path: Path) -> None:
        calls.append(path)

    # Store calls list directly on the function
    mock_callback.calls = calls  # type: ignore
    return mock_callback


@pytest.fixture
def watcher(callback: Callable[[Path], None]) -> ProjectWatcher:
    """Create a ProjectWatcher instance for testing."""
    return ProjectWatcher(Path("."), callback)


def test_should_process_file(watcher: ProjectWatcher, tmp_path: Path) -> None:
    """Test file filtering logic."""
    # Should process
    source_file = tmp_path / "test.py"
    source_file.touch()
    assert watcher._should_process_file(source_file)

    # Should not process
    git_file = tmp_path / ".git" / "config"
    git_file.parent.mkdir()
    git_file.touch()
    assert not watcher._should_process_file(git_file)

    cache_file = tmp_path / "__pycache__" / "test.pyc"
    cache_file.parent.mkdir()
    cache_file.touch()
    assert not watcher._should_process_file(cache_file)


def test_on_modified(watcher: ProjectWatcher, tmp_path: Path) -> None:
    """Test file modification handling."""
    # Valid file
    test_file = tmp_path / "test.py"
    test_file.touch()
    event = FileModifiedEvent(str(test_file))
    watcher.on_modified(event)
    assert test_file in watcher._modified_files

    # Invalid file
    git_file = tmp_path / ".git" / "config"
    git_file.parent.mkdir()
    git_file.touch()
    event = FileModifiedEvent(str(git_file))
    watcher.on_modified(event)
    assert git_file not in watcher._modified_files


def test_should_process_compiled_files(tmp_path: Path) -> None:
    """Test that compiled Python files are not processed."""

    def dummy_callback(path: Path) -> None:  # pylint: disable=unused-argument
        pass

    watcher = ProjectWatcher(tmp_path, callback=dummy_callback)

    # Test .pyc file
    pyc_file = tmp_path / "test.pyc"
    pyc_file.touch()
    assert not watcher._should_process_file(pyc_file)

    # Test .pyo file
    pyo_file = tmp_path / "test.pyo"
    pyo_file.touch()
    assert not watcher._should_process_file(pyo_file)

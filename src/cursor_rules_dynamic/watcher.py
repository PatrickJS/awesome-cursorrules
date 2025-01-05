"""File system watcher for cursor rules."""

from pathlib import Path
from typing import Callable, Set, Union

from watchdog.events import DirModifiedEvent, FileModifiedEvent, FileSystemEventHandler


class ProjectWatcher(FileSystemEventHandler):
    """Watches for file changes in the project directory."""

    def __init__(self, project_path: Path, callback: Callable[[Path], None]) -> None:
        """Initialize the project watcher.

        Args:
            project_path: The root path of the project to watch.
            callback: Function to call when a file is modified.
        """
        super().__init__()
        self.project_path = project_path
        self.callback = callback
        self._modified_files: Set[Path] = set()

    def _should_process_file(self, file_path: Path) -> bool:
        """Determine if a file should be processed based on its path.

        Args:
            file_path: Path to the file to check.

        Returns:
            bool: True if the file should be processed, False otherwise.
        """
        # Skip files in .git directory
        if ".git" in file_path.parts:
            return False

        # Skip __pycache__ directories
        if "__pycache__" in file_path.parts:
            return False

        # Skip compiled Python files
        if file_path.suffix in {".pyc", ".pyo"}:
            return False

        return True

    def on_modified(self, event: Union[DirModifiedEvent, FileModifiedEvent]) -> None:
        """Handle file modification events.

        Args:
            event: The file or directory modification event.
        """
        if isinstance(event, FileModifiedEvent):
            file_path = Path(str(event.src_path))
            if self._should_process_file(file_path):
                self._modified_files.add(file_path)
                self.callback(file_path)

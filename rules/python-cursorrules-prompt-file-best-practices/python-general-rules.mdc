---
description: Applies general Python development guidelines including typing, docstrings, dependency management, testing with pytest, and code style using Ruff.
globs: **/*.py
---
- For any python file, be sure to ALWAYS add typing annotations to each function or class. Be sure to include return types when necessary.
- Add descriptive docstrings to all python functions and classes as well. Please use pep257 convention. Update existing docstrings if need be.
- Make sure you keep any comments that exist in a file.
- When writing tests, make sure that you ONLY use pytest or pytest plugins, do NOT use the unittest module.
- All tests should have typing annotations as well.
- All tests should be in ./tests. Be sure to create all necessary files and folders. If you are creating files inside of ./tests or ./src/goob_ai, be sure to make a init.py file if one does not exist.
- All tests should be fully annotated and should contain docstrings.
- Be sure to import the following if TYPE_CHECKING:
  from _pytest.capture import CaptureFixture
  from _pytest.fixtures import FixtureRequest
  from _pytest.logging import LogCaptureFixture
  from _pytest.monkeypatch import MonkeyPatch
  from pytest_mock.plugin import MockerFixture
- Dependency management via https://github.com/astral-sh/uv and virtual environments.
- Code style consistency using Ruff.
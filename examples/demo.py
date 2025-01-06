#!/usr/bin/env python3
"""Demo script to show the functionality of cursor-rules-dynamic."""

import time
from pathlib import Path

from cursor_rules_dynamic.analyzer import CodeAnalyzer
from cursor_rules_dynamic.rules_manager import RulesManager
from cursor_rules_dynamic.watcher import ProjectWatcher


def process_violations(file_path: Path) -> None:
    """Process any decorator violations found in the file."""
    rules_manager = RulesManager(Path(".cursorrules"))
    # Set up some rules about which decorators to check
    rules_manager.update_rules({
        "decorator_pattern": [
            "@property",
            "@staticmethod",
            "@classmethod",
            "@deprecated"
        ]
    })
    
    analyzer = CodeAnalyzer(rules_manager)
    violations = analyzer.analyze_file(file_path)
    if violations:
        print(f"\nViolations found in {file_path}:")
        for violation in violations:
            print(f"  - {violation}")
    else:
        print(f"\nNo violations found in {file_path}")


def main() -> None:
    """Run the demo."""
    # Create a test file with some decorators
    test_file = Path("example_code.py")
    test_file.write_text("""
@property
def my_property():
    return 42

@staticmethod
def my_static_method():
    pass

@classmethod
def my_class_method(cls):
    pass

@deprecated
def old_method():
    pass

def normal_method():
    pass
""")

    print("Created example_code.py with various decorators")
    print("Starting file watcher...")
    
    # Set up the file watcher
    watcher = ProjectWatcher(Path("."), process_violations)
    
    # Process the initial file
    process_violations(test_file)
    
    print("\nWatcher is running. Try modifying example_code.py...")
    print("Press Ctrl+C to exit")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nCleaning up...")
        test_file.unlink()  # Remove the test file
        print("Done!")


if __name__ == "__main__":
    main() 
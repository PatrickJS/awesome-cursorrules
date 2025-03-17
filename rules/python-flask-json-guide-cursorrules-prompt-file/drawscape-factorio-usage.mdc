---
description: Specifies how to use the custom Drawscape Factorio Python module in Python files.
globs: **/*.py
---
- When working with Python files in this project, always utilize the custom Drawscape Factorio module.
- Use the `createFactorio` and `importFUE5` functions from the `drawscape_factorio` module.
- Ensure the following import statements are present: `from drawscape_factorio import create as createFactorio` and `from drawscape_factorio import importFUE5`.
- When using `importFUE5`, load the exported entities JSON file and pass the data to the function.
- When calling `createFactorio`, provide the imported data and a configuration dictionary with `theme_name`, `color_scheme`, and `show_layers`.
- Write the resulting SVG string to an output file.
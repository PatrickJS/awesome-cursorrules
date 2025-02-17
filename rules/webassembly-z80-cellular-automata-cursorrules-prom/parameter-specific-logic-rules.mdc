---
description: Rules for implementing parameter-specific logic in the cellular automata simulation. These rules detail how each parameter influences the simulation.
globs: /src/parameter_logic/**/*.*
---
- Implement Parameter-Specific Logic:
  - For each parameter in the region structure, create dedicated functions or methods to apply its effects. For example:
    - Obstacle: Turns the cell into an obstacle, preventing it from being randomly selected, and preventing neighbor soup cells from interacting with it.
    - Directional influence: Adjust the probability of a cell interacting with neighbors in specific directions.
    - Randomness: Introduce variability in state transitions or cell behavior.
    - Temperature: Affect the overall activity level or energy of cells within the region.
    - Energy level: Influence the likelihood of certain operations or state changes.
  - Design these functions to be modular and easily expandable, allowing for the addition of new parameters in the future without major code restructuring.
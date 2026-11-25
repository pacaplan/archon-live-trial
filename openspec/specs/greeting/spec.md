# greeting Specification

## Purpose

The greet CLI prints a greeting for a name.

## Requirements

### Requirement: Greet by name

The CLI SHALL print `Hello, <name>!` for the name given as its first argument.

#### Scenario: Name given

- **WHEN** the user runs `greet Ada`
- **THEN** the CLI prints `Hello, Ada!` and exits 0

### Requirement: Name is required

The CLI SHALL print a usage line to standard error and exit 1 when no name is given.

#### Scenario: No name

- **WHEN** the user runs `greet` with no arguments
- **THEN** the CLI prints `usage: greet NAME` to standard error and exits 1

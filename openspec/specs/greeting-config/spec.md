# greeting-config Specification

## Purpose
TBD - created by archiving change add-greeting-config. Update Purpose after archive.

## Requirements

### Requirement: Greeting comes from greet.json

When `greet.json` exists in the current directory and has a string `greeting` field, the CLI SHALL print `<greeting>, <name>!`.

#### Scenario: Custom greeting

- **WHEN** `greet.json` contains `{"greeting": "Hi"}` and the user runs `greet Ada`
- **THEN** the CLI prints `Hi, Ada!` and exits 0

### Requirement: Default greeting without the file

When `greet.json` does not exist in the current directory, the CLI SHALL print `Hello, <name>!`.

#### Scenario: No config file

- **WHEN** there is no `greet.json` and the user runs `greet Ada`
- **THEN** the CLI prints `Hello, Ada!` and exits 0

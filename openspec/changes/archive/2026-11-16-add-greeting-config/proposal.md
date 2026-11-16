## Why

Teams want their own greeting word, such as "Hi" or "Welcome", without changing the code.

## What Changes

- The CLI reads an optional `greet.json` file from the current directory.
- Its `greeting` field replaces "Hello" in the output.
- Without the file, the output stays `Hello, <name>!`.

## Capabilities

### New Capabilities

- `greeting-config`: reading the greeting word from `greet.json`.

### Modified Capabilities

None.

## Technical Approach

The CLI reads the file with `node:fs`, parses it as JSON and passes the greeting to `greet`. `greet` takes the greeting as a second parameter, with "Hello" as the default.

## Out of Scope

- Other config fields.
- A flag or environment variable that names another config file.

## Impact

`src/cli.ts`, `src/greet.ts`, a new `src/config.ts`, and their tests.

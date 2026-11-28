## Coverage Strategy

Specifications remain the source of unit-test requirements. This plan records only additional integration and end-to-end obligations, the acceptance testing envelope, and exceptional human-only obligations.

## Integration Tests

### INT-001: The CLI reads greet.json from its working directory

- Covers: "Greeting comes from greet.json", "Default greeting without the file"
- Boundary: the CLI process and the real filesystem
- Setup: a temporary directory, with and without a `greet.json`
- Action: run `bun <repo>/src/cli.ts Ada` with the temporary directory as the working directory
- Assertions: standard output and the exit code match the spec
- Execution: `bun test`

## End-to-End Tests

None. INT-001 already runs the CLI itself.

## Acceptance Testing Envelope

- Environments and sandboxes: the run's worktree and temporary directories.
- Credentials and secrets: none are needed.
- Authorized effects: local files under the worktree and temporary directories, removed when done.
- Off limits: anything outside the worktree and temporary directories.
- Permitted substitutes: None.
- Known risk areas: None known.

## Human-Only Testing

None.

## Coverage Map

| Requirement or journey | INT | E2E | HT |
| --- | --- | --- | --- |
| Greeting comes from greet.json | INT-001 | — | — |
| Default greeting without the file | INT-001 | — | — |

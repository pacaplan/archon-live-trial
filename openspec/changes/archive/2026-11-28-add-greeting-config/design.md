## Context

`src/cli.ts` reads the name from its first argument and calls `greet(name)` from `src/greet.ts`.

## Approach

- `greet(name, greeting = 'Hello')` returns `<greeting>, <name>!`.
- A new `src/config.ts` exports `readGreeting(dir)`. It returns the `greeting` field of `<dir>/greet.json`, or `undefined` when the file does not exist.
- `src/cli.ts` calls `readGreeting(process.cwd())` and passes the result to `greet`.

## Decisions

- The file is read synchronously. The CLI does one thing and exits.

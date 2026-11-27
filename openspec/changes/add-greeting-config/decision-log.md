## DECIDE-1: Implementation — greeting precedence

- Step — Implement `add-greeting-config`.
- Question — Which greeting applies when the existing requirement calls for “Hello” and the new requirement supplies a string from `greet.json`?
- Requirement — The new specification calls for the configured string when present and “Hello” when the file is absent. The base specification also defines the no-name usage and exit status.
- Decision — Use the approved change's more specific rule when a string is configured, including an empty string. Keep the default for an absent file and handle a missing name before reading config.
- Alternatives — Apply the original “Hello” output unconditionally, or read config before checking the name.
- Rationale — The change explicitly introduces the override. Checking the name first preserves the base usage and exit status even if config cannot be read. See `evidence/decision-context.log`.
- What breaks if it is wrong — Configured greetings could be ignored, or a config failure could prevent the required no-name usage response.

## DECIDE-2: Implementation — config outside the two specified cases

- Step — Implement `readGreeting(dir)`.
- Question — How should malformed JSON, a missing or non-string greeting, and file read errors behave?
- Requirement — The change requires an override for a string field and a default for a missing file. It specifies no result for malformed, incomplete, or unreadable config.
- Decision — Treat a parsed config with no string greeting as having no override. Return `undefined` on `ENOENT` and allow JSON parse failures and other filesystem errors to propagate.
- Alternatives — Fall back on all errors, or reject every parsed config without a string greeting.
- Rationale — The string check implements the condition on the override. A read or parse failure cannot establish that condition, and propagating the error keeps the underlying cause visible. See `evidence/decision-context.log`.
- What breaks if it is wrong — A caller expecting a default from malformed or unreadable config would receive an error. A caller expecting strict validation of missing or non-string fields would receive the default greeting.

## DECIDE-3: Audit — implementor's greeting precedence and unspecified config handling

- Step — Audit of `add-greeting-config` (inspection only).
- Question — Are the two implementor decisions above valid within the approved definition: (a) a configured string, including an empty one, overrides "Hello"; (b) a parsed config without a string greeting uses the default, while JSON parse errors and non-ENOENT read errors propagate?
- Requirement — "Greeting comes from greet.json" applies to any string field. "Default greeting without the file" covers only an absent file. The design has `readGreeting` return `undefined` for an absent file. The base spec "Greet by name" still says `Hello, <name>!` without qualification, and the proposal lists no modified capabilities.
- Decision — Accept both. No audit finding, and no added test obligation for the cases in (b), because the definition does not describe them.
- Alternatives — Report (b) as an unapproved or untested behavior; fall back to "Hello" on every config error; treat the base "Hello" requirement as blocking the override.
- Rationale — The proposal explicitly says the `greeting` field replaces "Hello", so the override is the approved intent. In `src/config.ts`, only ENOENT is treated as an absent file, so other failures are not silently hidden. `src/cli.ts` still checks for a missing name before reading config. No approved requirement is changed.
- What breaks if it is wrong — Users with a malformed or unreadable `greet.json` get an error instead of a greeting, and those with a non-string field silently get "Hello"; no test guards either behavior. The unqualified base "Greet by name" text may also conflict with the new capability once the change is archived.

## DECIDE-4: Acceptance — round 0 malformed config outcome

- Step — Acceptance exploration of `add-greeting-config`.
- Question — Should malformed `greet.json` cause the CLI to fail or fall back to `Hello`?
- Requirement — Approved spec defines string greeting override and absent-file default; malformed JSON is unspecified.
- Reading tested — Malformed JSON file in external scratch cwd, CLI invoked for Ada.
- Alternatives — Propagate a parse error; ignore invalid content and use the default; reject invalid config with a different user-facing message.
- Rationale — Observed `SyntaxError: Invalid JSON in .../greet.json: JSON Parse error: Unexpected EOF`, exit 1; this is an observation, not an oracle. Refer to `acceptance-commands/round-0/command-4.txt`.
- What breaks if wrong — Users may see an uncaught runtime stack trace instead of a default greeting or actionable config error. Human acceptance should decide whether malformed config is defined behavior.

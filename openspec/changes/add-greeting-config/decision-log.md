## DECIDE-1: Implementation behavior for an invalid or unreadable config

- Step — Implement add-greeting-config.
- Question — What should happen if a present config has no string greeting, contains malformed JSON, or cannot be read?
- Requirement — The approved spec uses every string greeting and defaults to Hello when the file is absent. The design calls for reading and parsing greet.json synchronously. See `evidence/approved-config-requirements.log`.
- Decision — Use Hello when valid JSON supplies no string greeting. Preserve empty strings. Let malformed JSON and read errors other than file absence surface as errors.
- Alternatives — Treat all invalid configs as absent, or fail whenever a present config supplies no string greeting.
- Rationale — A value outside the specified string type supplies no greeting override. Propagating read and parse failures makes a broken file visible without adding a custom error interface.
- What breaks if wrong — A caller expecting strict field validation would see a default greeting. A caller expecting every broken config to be ignored would see a command failure for unreadable files or malformed JSON.

## DECIDE-2: Audit: validity of the invalid-config behavior

- Step — Audit add-greeting-config.
- Question — Is the implementor's handling of a missing string `greeting`, malformed JSON, and read errors other than file absence compliant?
- Requirement — The spec requires `<greeting>, <name>!` for a string `greeting` and `Hello, <name>!` when `greet.json` is absent. The design says `readGreeting(dir)` returns the `greeting` field, or `undefined` when the file does not exist. Neither specifies an outcome for these other cases.
- Decision — Accept it. A non-string or missing field in parsed JSON gives `Hello` (a top-level `null` does too), an empty string is kept, and parse errors and non-ENOENT read errors propagate. The definition describes none of these as a failure case, so this audit requires no added checklist row or test for them.
- Alternatives — Return non-string values unchanged and print them; reject a present config that has no string `greeting`; treat every unreadable or malformed config as absent.
- Rationale — This meets both specified outcomes and keeps the `string | undefined` result consistent with `greet`. Only ENOENT is treated as file absence, so other failures are not hidden.
- What breaks if wrong — Users who expect an error for a missing or non-string field would see `Hello`. Users who expect broken files to be ignored would see the command fail. No test cited by the checklist covers these cases against regression.

## DECIDE-3: Audit: baseline "Greet by name" spec and the custom greeting

- Step — Audit add-greeting-config.
- Question — `openspec/specs/greeting/spec.md`, "Greet by name", requires `Hello, <name>!` without conditions, while the change requires `<greeting>, <name>!` when `greet.json` has a string `greeting`. Which governs?
- Requirement — The proposal says the `greeting` field replaces "Hello" and that output without the file is unchanged. It also lists no modified capabilities.
- Decision — The approved change governs when `greet.json` supplies a string `greeting`; the baseline output still applies when the file is absent. This is not an implementation finding, and no approved requirement or spec file is edited.
- Alternatives — Keep `Hello` in all cases, which would defeat the change; treat the overlap as blocking; amend the baseline requirement, which this audit may not do.
- Rationale — The proposal's intent and the "Custom greeting" scenario are explicit, so a compliant implementation of the change is possible without the user.
- What breaks if wrong — If the baseline were meant to stay unconditional, custom greetings would violate it. Archiving the change without qualifying "Greet by name" would leave the main specs inconsistent.

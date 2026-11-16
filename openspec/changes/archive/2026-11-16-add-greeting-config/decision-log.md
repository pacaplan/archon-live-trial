## D-01: Implementation: unspecified configuration errors

- Step: implement add-greeting-config.
- Question: should malformed JSON or filesystem errors other than a missing file silently select the default?
- Requirement: the design returns undefined when greet.json does not exist and otherwise parses JSON to return its greeting field.
- Decision: catch only ENOENT during the file read; let JSON parsing and other filesystem errors propagate. Add no schema validation or custom error interface.
- Alternatives: silently default on all errors; introduce validation and custom diagnostics.
- Rationale: only missing-file fallback is approved; the alternatives would introduce additional behavior. Saved requirement output: `evidence/config-error-policy-reference.txt`.
- What breaks if wrong: malformed or unreadable configuration terminates the CLI rather than printing a default greeting.
- Decision pending from the user: none; no approved requirement is changed.

## D-02: Audit: valid JSON without a string greeting field

- Step: audit of add-greeting-config against the approved definition.
- Question: what should the CLI do when greet.json exists and parses, but has no `greeting` field, a non-string `greeting` (number, null, object), or a top-level value that is not an object (`null`, array, number)?
- Requirement: specs/greeting-config/spec.md applies the custom greeting only when `greet.json` "has a string `greeting` field"; design.md says `readGreeting` returns "the `greeting` field" or `undefined` when the file does not exist; checklist I-2 says it returns "the string `greeting` field". The definition does not say what happens otherwise.
- Decision: valid JSON that has no string `greeting` field yields `undefined`, so the CLI prints the default `Hello, <name>!`. This includes a top-level `null`, which must not throw a TypeError. Invalid JSON and non-ENOENT filesystem errors still propagate, as the implementor decided.
- Alternatives: pass any value through (current code, so `{"greeting":5}` prints `5, Ada!` and `{"greeting":null}` prints `null, Ada!`); throw a validation error for a non-string greeting.
- Rationale: the spec's custom-greeting condition is a string field, and the declared return type is `string | undefined`. Falling back to the default stays inside the approved behavior and adds no new error interface.
- What breaks if wrong: if users expect a loud error for a non-string greeting, they will silently get `Hello` instead.
- Decision pending from the user: none; no approved requirement is changed.

## D-03: Resolve findings: guard the configured greeting type

- Step: resolve audit finding 1.
- Question: what should valid JSON without a string greeting return?
- Requirement: custom formatting applies to a string greeting; readGreeting returns string or undefined. Saved requirement output: `evidence/resolve-requirements.txt`.
- Decision: independently adopt the default for missing or non-string fields and non-object JSON, using a null-safe type guard. Preserve all strings, including an empty string. This supersedes the original implementation decision to add no validation only as to the required string-field guard; invalid JSON and filesystem error policy remain unchanged.
- Alternatives: pass values through; throw a custom validation error.
- Rationale: restrict custom output to the approved string condition and reuse the existing undefined default without a new error interface.
- What breaks if wrong: users expecting invalid field types to produce a loud error will receive Hello instead.
- Decision pending from the user: none; no approved requirement is changed.

## D-04: Resolve findings: verify configuration errors across the CLI boundary

- Step: resolve audit finding 2.
- Question: how to prove the recorded propagation policy at the process boundary?
- Requirement: the user requests verification of the CLI exit code and stderr for the recorded error policy; the existing config error policy remains in force.
- Decision: add automated CLI tests for malformed JSON and a greet.json directory causing EISDIR, asserting exit 1, the corresponding stderr error, and empty stdout. Add unit coverage of the filesystem error too. The explicit finding-resolution request authorizes these process tests beyond the original named test cases.
- Alternatives: keep only the SyntaxError unit assertion; silently default on errors.
- Rationale: a unit test cannot demonstrate process exit behavior. Saved checks will be `evidence/resolve-tier-2.log` and `evidence/resolve-I-2.log`.
- What breaks if wrong: tests may constrain future diagnostic changes; only error categories are matched rather than complete runtime-specific stack traces.
- Decision pending from the user: none.

## D-01: Implementation: config read failures

- Step: implement `readGreeting`.
- Question: should invalid JSON or filesystem failures other than a missing file silently use the default?
- Requirement: the design returns `undefined` when `greet.json` does not exist and otherwise parses JSON and returns its `greeting` field; no recovery behavior is specified for other errors.
- Decision: catch only `ENOENT`; propagate other read errors and JSON parse errors. Do not add config validation or additional recovery policies.
- Alternatives: swallow all failures and use Hello, or add custom validation and diagnostics.
- Rationale: this follows the specified missing-file fallback without expanding it into unapproved recovery behavior. This is based on the approved definition, not experimental output; the automated verification will be saved in `evidence/config-errors.log`.
- What breaks if wrong: malformed or unreadable configs will fail instead of greeting with a fallback.
- Decision pending from the user: none; no approved requirement is changed.

## D-02: Before-pr R1: validate the config boundary

- Step: resolve R1 in current review cycle 0.
- Question: how should valid JSON with a non-object document or non-string greeting be handled?
- Requirement: configured string greetings must be preserved, and a missing config must default to Hello; invalid-value behavior is unspecified.
- Decision: accept R1 and validate the parsed unknown value as an object with an optional string greeting. Reject null, arrays, primitive documents, and present non-string greetings with a path-bearing error. Keep a missing greeting undefined, as in the reviewer suggestion and original design; do not require the field or reject other fields. Preserve SyntaxError for malformed JSON while adding the config path and cause.
- Alternatives: leave raw values unchecked, or require a greeting field. The latter would introduce a new required-field policy.
- Rationale: enforce the reader return type at the filesystem boundary while preserving all approved behavior. This refines the earlier no-validation decision for unspecified inputs in response to R1.
- Saved verification: evidence/review-R1-config.log; evidence/review-R1-I-1.log; evidence/review-R1-I-2.log.
- What breaks if wrong: callers relying on coercion of non-string greetings now receive errors. Misspelled greeting fields continue to default, because missing-field rejection was not requested by the proposed validation or approved definition.
- Decision pending from the user: none; no approved requirement changed.

## D-03: Before-pr R2: present config failures as CLI diagnostics

- Step: resolve R2 in current review cycle 0.
- Question: how should the CLI present propagated config failures?
- Requirement: configured strings and absent files must print the approved greeting and exit 0; error presentation for invalid configs is unspecified.
- Decision: accept R2, catch config failures at the CLI boundary, print one prefixed error message naming the full config path to stderr, and return exit status 1 with no greeting. Expose an in-process main function and keep execution guarded by import.meta.main so affected behavior can be unit tested without forbidden subprocess integration tests.
- Alternatives: retain uncaught stack traces, or swallow failures and greet with Hello.
- Rationale: make failures diagnosable while preserving successful behavior and the existing no-name usage path. Reader errors still propagate to callers; only the CLI presentation changes. The full path is added at the CLI boundary because Bun EISDIR messages do not necessarily contain it.
- Saved verification: evidence/review-R2-cli-unit.log, six passing in-process unit tests covering success, malformed JSON, invalid config shape/type, filesystem errors, and usage failure. evidence/review-R2-cli-unit-initial-failure.log records the initial missing EISDIR path and unsupported test matcher, both corrected before the passing run.
- What breaks if wrong: consumers parsing raw CLI stack traces now receive a concise message; importing cli.ts no longer executes the CLI. Direct executable invocation retains the same success/usage contract. Process-level INT-001 remains not verified after the changes because this review round forbids integration runs.
- Decision pending from the user: none; no approved requirement changed.

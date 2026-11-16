## D-01: Implementation: configuration outside the defined scenarios

- Step: implement `readGreeting`.
- Question: how should configuration without a string greeting, malformed JSON, and filesystem failures behave?
- Requirement: the approved definition requires string greetings to override the default and missing files to return `undefined`; it does not define other configuration outcomes. Source: `evidence/approved-definition.txt`.
- Decision: return `undefined` for a missing or non-string field; preserve every string, including an empty string. Catch only missing-file (`ENOENT`) errors and propagate JSON parsing errors and other filesystem failures.
- Alternatives: coerce non-string fields, reject them, or suppress all read and parse errors.
- Rationale: only strings are approved greeting values; the optional file fallback should not hide unreadable or malformed configuration. No new CLI flags or configuration fields are added.
- What breaks if wrong: users with invalid configurations might expect an error instead of fallback, or fallback instead of propagated errors.
- Pending user decision: none; these unspecified cases are resolved within the approved scope.

## D-01: Implementation: config errors outside the specified cases

- Step: implement `readGreeting`.
- Question: should unreadable or malformed config silently use the default?
- Requirement: the approved design returns `undefined` when the file does not exist; the spec defines a string greeting and the absent-file fallback.
- Decision: catch only the missing-file (`ENOENT`) read error; let other read errors and JSON parsing errors propagate. Return the parsed greeting field without adding validation rules for unspecified config shapes.
- Alternatives: silently default on every error, or introduce config validation and custom diagnostics.
- Rationale: retain the approved narrow fallback and avoid inventing configuration policies. Saved definition: `evidence/approved-definition.txt`.
- What breaks if wrong: malformed or unreadable config terminates the CLI instead of greeting; invalid config shapes have no promised handling.
- Decision pending from user: none; no approved requirement is changed.

## D-02: Audit: config content and read errors outside the specified conditions

- Step: audit of add-greeting-config.
- Question: is it valid that `readGreeting` returns the raw `greeting` value without checking it is a string, and lets malformed JSON or non-ENOENT read errors crash the CLI?
- Requirement: spec.md says the CLI SHALL print `<greeting>, <name>!` when greet.json exists with a string `greeting` field, and `Hello, <name>!` when the file does not exist. design.md says `readGreeting` returns the `greeting` field, or `undefined` when the file does not exist.
- Decision: accept the implementor's decision. Behavior for malformed, unreadable, or non-string-greeting config is outside both requirements, so no approved requirement is weakened. It does need its own checklist row with evidence, because the code and tests now define it.
- Alternatives: silently fall back to `Hello` on every error or on a non-string greeting; validate and print a diagnostic.
- Rationale: either alternative would invent a policy the definition does not approve. Propagating errors does not hide a bad config file.
- What breaks if wrong: users with a bad greet.json get a stack trace and a non-zero exit instead of the default greeting, and `{"greeting":null}` prints `null, Ada!`.
- Decision pending from user: none for this audit. The user may later want a defined behavior for invalid config.

## D-03: Resolve finding 1: state the invalid-config contract explicitly

- Step: resolve the audit finding for add-greeting-config.
- Question: expand the approved contract for invalid config, add a checklist requirement, or explicitly document its undefined behavior?
- Requirement: the approved spec guarantees string-field config and absent-file behavior only; the finding permits an explicit undefined-behavior note.
- Decision: explicitly state in I-2 Evidence that invalid config is undefined behavior under the approved definition, including malformed JSON, JSON null, absent/non-string fields, and non-missing-file read errors. No output, exit code, fallback, validation, or return-type guarantee applies to these inputs. Existing error tests describe the current implementation, not approved requirements. Preserve all planned checklist cells and runtime code.
- Alternatives: add a row treating current incidental behavior as required, or add validation/defaults for unsupported inputs.
- Rationale: make the verification boundary explicit without inventing approved behavior. The saved targeted run names both error tests as well as the string-field and absent-file tests: `evidence/finding-1-config-tests.txt`. Original approved definition: `evidence/approved-definition.txt`.
- What breaks if wrong: consumers might expect a defined result for invalid config, whereas this change deliberately makes no such promise.
- Decision pending from user: none; defining invalid-config handling would need a future approved requirement.

## D-04: Before-pr R1: validate external config values

- Step: resolve current before-pr review finding R1.
- Question: how to handle non-object JSON and non-string greeting fields without changing approved valid-string/absent-file behavior?
- Requirement: preserve custom strings and missing-file default; the current user authorizes fixing the runtime validation finding.
- Decision: reject null, arrays, and non-object documents with a path-bearing error; reject present non-string greeting fields with a path-bearing error; allow an absent greeting field to return undefined. Preserve empty strings. This supersedes the prior raw-field choice; invalid input remains outside the approved specification.
- Alternatives: decline because invalid config is unspecified, or silently default invalid fields.
- Rationale: uphold the declared return type and prevent non-string greeting output. Saved passing unit output: `evidence/R1-config-unit-final.txt`; initial test-fixture failure: `evidence/R1-config-unit.txt`.
- What breaks if wrong: callers relying on numeric/null greetings or non-object fallback now receive an exception.
- Decision pending from user: none. I-4/I-5 remain not verified because integration checks are forbidden this round (`evidence/review-cli-not-rerun.txt`).

## D-05: Before-pr R2: path-bearing errors and concise CLI diagnostics

- Step: resolve current before-pr review finding R2.
- Question: how should unspecified read/parse failures be reported while retaining approved greetings and missing-file fallback?
- Requirement: preserve specified success behavior; the review request authorizes path-bearing read/parse errors with original causes and a one-line CLI error with exit 1.
- Decision: wrap non-ENOENT reads as Failed to read <file>, wrap invalid JSON as Invalid JSON in <file>, preserve both causes, and catch errors in the CLI to print the message with CR/LF replaced by spaces and exit 1. Validation errors from R1 follow the same CLI reporting path. No custom policy for other config fields is added.
- Alternatives: keep raw exceptions, or include the entire underlying stack in stderr.
- Rationale: identify the file without an uncaught stack while retaining diagnostic causes for programmatic callers. Saved unit output and CLI inspection: `evidence/R2-config-unit.txt`.
- What breaks if wrong: callers expecting raw SyntaxError or raw filesystem error classes now receive an Error with the original in cause; scripts parsing stack-trace output see a single message instead.
- Decision pending from user: none. Integration checks remain prohibited; I-4/I-5 are explicitly not verified, as documented in `evidence/review-cli-not-rerun.txt`.

## D-06: Before-pr R3: include failure reasons in wrapped config messages

- Step: resolve current review finding R3; R1/R2 are closed and no action is taken on them.
- Question: expose the original reason through CLI cause traversal or through the wrapper message?
- Requirement: preserve approved greeting behavior and address missing diagnostic detail; integration tests are forbidden this round.
- Decision: include String(original error) in read/parse wrapper messages and retain cause. Existing CLI prints the enriched message with CR/LF normalized to spaces. CLI code need not change.
- Alternatives: append cause.message in CLI, or keep only a file-level summary.
- Rationale: make the reason visible to all callers at the error-wrapping boundary without duplicate cause handling. Saved passing unit output: `evidence/R3-config-unit-final.txt`; initial assertion-order failure retained in `evidence/R3-config-unit.txt`.
- What breaks if wrong: consumers matching exact wrapper messages now see additional underlying details. Original causes are unchanged.
- Decision pending from user: none. I-4/I-5 remain not verified because their planned integration checks are prohibited; see `evidence/review-cli-not-rerun.txt`.

## D-07: PR comment: preserve JSON-only missing-file behavior

- Step: handle PR #5 comments.
- Question: add YAML fallback when greet.json is missing, as requested by pacaplan at src/config.ts line 15?
- Requirement: approved spec “Default greeting without the file” requires Hello when greet.json is absent; design reads only <dir>/greet.json. The current workflow prohibits changes to approved behavior/design/scope.
- Decision: do not implement YAML fallback. Record dispute 1, reply with the requirement conflict, and leave the thread unresolved for acceptance or planning. Implement only the separate explanatory-comment request at line 10.
- Alternatives: silently expand supported formats and alter missing-JSON behavior; or obtain a revised approved definition through the designated workflow.
- Rationale: the JSON-absent/YAML-present scenario would produce different output under the proposed feature. Saved scope inspection: `evidence/PR-yaml-scope.txt` in the run artifacts.
- What breaks if wrong: users expecting the requested YAML support still receive the approved Hello greeting until a revised change is approved and implemented.
- Decision pending from user: acceptance or planning must decide whether to add YAML, including precedence, supported structure, parsing/error policy, and the revised missing-JSON requirement. Finalization cannot continue with this request unresolved.

## DECIDE-1: Apply the configured greeting to the existing CLI

- Step — Implement add-greeting-config.
- Question — What should the CLI print when a name and a configured greeting are both present?
- Requirement — The existing greeting spec describes Hello for a name. The approved change specifically requires the configured string when greet.json supplies one and Hello when the file is missing.
- Decision — Apply the new requirement in the configured case. Keep Hello when the file is missing and preserve the existing missing-name usage path.
- Alternatives — Apply the original Hello rule to every invocation, or revise the approved artifacts.
- Rationale — The new requirement governs the narrower configured case and the approved default preserves the existing output in the unconfigured case. See `config-behavior-decisions.txt`.
- What breaks if this is wrong — A CLI that always prints Hello fails the custom greeting scenario. Moving config loading before argument validation could also change the missing-name outcome.
- User decision pending — None.

## DECIDE-2: Handle invalid or unreadable greeting configuration

- Step — Implement add-greeting-config.
- Question — How should the CLI handle an existing config that is unreadable, malformed JSON, or missing a string greeting?
- Requirement — The approved spec defines the output for a string greeting and for a missing file. The design returns undefined for a missing file and gives no outcome for invalid or unreadable contents.
- Decision — Treat a missing file as the default case, propagate other read and JSON errors, and throw a clear error for a missing or non-string greeting. Accept every string, including an empty one.
- Alternatives — Default to Hello for invalid or unreadable configs, or coerce non-string values.
- Rationale — Returning undefined for invalid contents would make a broken config look absent. Rejecting non-strings preserves the approved string contract without changing either scenario. See `config-behavior-decisions.txt`.
- What breaks if this is wrong — If callers expect defaults for invalid configs, those invocations will fail instead.
- User decision pending — None.

## DECIDE-3: Audit: accept failure on a present greet.json without a string greeting

- Step — Audit of add-greeting-config.
- Question — Is it compliant to throw when greet.json exists but has no string greeting (as well as on malformed JSON or a non-ENOENT read error), rather than print the default?
- Requirement — design.md says readGreeting returns the greeting field, or undefined when the file does not exist. The spec defines output only for a string greeting and for a missing file.
- Decision — Compliant. Keep the implementor's behavior.
- Alternatives — Read an absent greeting field as undefined, so a file such as `{}` prints Hello. Also default on malformed or unreadable files.
- Rationale — The approved default is tied to the file not existing. No approved requirement gives any output for these inputs, so failing contradicts none and does not hide a broken config.
- What breaks if this is wrong — A user with `{}` or another greet.json without a greeting gets a failed command instead of `Hello, <name>!`.
- User decision pending — None.

## DECIDE-4: Audit: require a triggering test for fixture cleanup

- Step — Audit of add-greeting-config.
- Question — Is source inspection enough for CHECK-6, which claims fixtures are removed even when an assertion fails?
- Requirement — test-plan.md says local files under temporary directories are removed when done. The audit rules require a test that triggers each cleanup case the definition describes.
- Decision — Not enough. Report it as a finding. The try/finally code looks correct; the gap is the missing test.
- Alternatives — Accept inspection, reading the test-plan line as limiting only acceptance testing effects, not as a cleanup case that needs a test.
- Rationale — CHECK-6 cites that line for its cleanup claim, including the failure path, and no saved test makes the callback throw.
- What breaks if this is wrong — One small test of the test helper is added without being required.
- User decision pending — None.

## DECIDE-5: Verify fixture cleanup with an assertion failure

- Step — Resolve audit findings for add-greeting-config.
- Question — How should CHECK-6 verify that fixture cleanup runs after an assertion fails?
- Requirement — CHECK-6 covers cleanup on both success and assertion failure. The audit found that the prior source inspection did not exercise the failing callback.
- Decision — Verify both paths with unit tests of the existing helper. Assert that the failing path propagates the original assertion error and that neither path leaves the populated temporary directory behind.
- Alternatives — Retain inspection alone or induce failure in an integration test.
- Rationale — A focused unit test observes cleanup and error propagation directly without changing the helper or CLI. Both cases passed in `check-6-fixture-cleanup-tests.log`.
- What breaks if this is wrong — An incomplete test could miss a regression that leaves temporary files behind or swallows assertion failures.
- User decision pending — None.

## DECIDE-6: ACCEPT-1 — Rebind the acceptance workflow's artifact directory

- Step — Acceptance fix, round index 0.
- Question — Can this run provide the independent tester with an evidence directory allowed by its preparation rules?
- Requirement — The acceptance command passes the workflow's `$ARTIFACTS_DIR` as the evidence directory. Its preparation rules reject a canonical evidence directory inside the system temp folder or the worktree and stop before running any journey.
- Decision — Escalate the launcher configuration to the workflow owner. The issue is the caller-supplied artifact directory, so no product or OpenSpec change is warranted.
- Alternatives — Repair the caller binding by provisioning a run artifact directory outside both prohibited roots, or retry with the same binding. A scratch-only override cannot repair an invalid evidence directory, and a symlink pointing into the current directory still resolves under the prohibited root.
- Rationale — `acceptance-findings.md` and `acceptance-round-status.txt` record that preparation stopped before CLI testing. The canonical-path reproduction in `accept-1-artifact-path.log` confirms the evidence directory is under `/private/tmp`. The acceptance node derives both paths from the workflow-provided artifact directory and exposes no evidence-path input for this step.
- What breaks if this is wrong — A retry with the same binding stops at preparation again, leaving acceptance unverified.
- User decision pending — The workflow owner needs to provision and bind a compliant artifact root, then resume or relaunch acceptance with that binding. Keep the tester's preparation checks in effect.

## DECIDE-7: ACCEPT-1 — Round 1 still lacks a compliant artifact binding

- Step — Acceptance fix, round index 1.
- Question — Is there a current tester finding to fix, or does the prior workflow setup impediment remain?
- Requirement — Acceptance preparation requires a caller-bound evidence directory whose canonical path is outside the worktree and system temp tree.
- Decision — Carry forward the workflow-owner escalation. The supplied findings file is explicitly from round 0, and the requested round status file is absent. There is no round 1 product finding available to triage.
- Alternatives — Rebind the run's artifact root before retrying, or retry the existing binding. A product commit or a scratch-only override would leave the tester's evidence directory under the rejected root.
- Rationale — `accept-1-round-1-artifact-path.log` confirms that the supplied directory still resolves under `/private/tmp` and records the report heading and missing status. Those observations do not establish what the round 1 tester did.
- What breaks if this is wrong — Treating the round 0 report as a current result can hide a round 1 finding. Retrying the same path leaves the known preparation failure in place.
- User decision pending — The workflow owner must bind a compliant artifact root and rerun independent acceptance.

## DECIDE-8: Default when a config object has no greeting field

- Step — Review round 2, applying the answer to DECIDE-2.
- Decision — Use `Hello` when a JSON object omits `greeting`. This supersedes the missing-field decision in DECIDE-2 and DECIDE-3.
- Rationale — The reviewer selected `default-missing-field`. The approved scenarios still govern a missing file and a string greeting. The approved definition leaves the omitted-field case open.
- Boundary — A present non-string greeting, an array or other non-object root, malformed JSON, and read errors other than a missing file continue to fail.
- Evidence — `review-round-2-config-unit.log` and `review-round-2-cli-missing-field.log`.

## DECIDE-9: Reconcile the older greeting requirement in a follow-up

- Step — Review round 2, applying the answer to DECIDE-1.
- Decision — Carry the older greeting spec clarification into a follow-up. It should limit the older Hello requirement to when no greeting is supplied by config.
- Rationale — The selected `update-older-spec` option specifies a follow-up and retains the current precedence of the config requirement. The separate usage-line request is recorded in DISPUTE-1.

## DECIDE-10: Accept automated coverage for the greeting scenarios

- Step — Review round 2, applying the answers to ACCEPT-1 and failure:acceptance.
- Decision — Record the reviewer's acceptance of automated coverage for the greeting scenarios. The reviewer elected to handle the independent acceptance failure personally.
- Rationale — The reviewer's approval of the automated checks does not establish independent acceptance. The workflow setup failure remains visible.

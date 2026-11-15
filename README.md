# archon-live-trial

A small repository for live trials of the [Codagent workflow pack for Archon](https://github.com/Codagent-AI/agent-workflows/tree/main/factory-workflows/archon).

`greet` is a tiny bun CLI with one OpenSpec change, `add-greeting-config`, that `main` never implements. A live trial runs the pack's `codagent-implement-change` workflow on that change with real agents, on a new branch, and opens a draft pull request. After the trial, the pull request is closed and its branch deleted. The pack's README describes how to start one, under "Live trials".

`main` changes only to change the fixture itself.

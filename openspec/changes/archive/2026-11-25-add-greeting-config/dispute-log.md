## DISPUTE-1: Change the CLI usage line to uppercase NAME

Settled in review round 4

Request — The note on DECIDE-1 asks for `usage: greet NAME`.

Approved requirement — The “No name” scenario in `openspec/specs/greeting/spec.md` requires `usage: greet <name>` on standard error and exit status 1.

Spec edit: In `openspec/specs/greeting/spec.md`, under “Name is required” → “No name”, replace `usage: greet <name>` with `usage: greet NAME` in the THEN line. Keep standard error and exit status 1.

Approved edit — The round 3 answer selected `spec-edit`. The canonical spec and CLI now print `usage: greet NAME` to standard error and exit 1 when no name is supplied.

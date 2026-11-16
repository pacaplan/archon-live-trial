## PR comment: YAML fallback

- Dispute number: 1.
- Comment: `src/config.ts`, line 15, author `pacaplan`, PR #6 comment 4583471586.
- Asked for: read `greet.yaml` when `greet.json` is missing.
- Why not fixed: the approved "Default greeting without the file" requirement says that absent `greet.json` produces `Hello, <name>!`, and the design returns `undefined` when that file is missing. Reading YAML could instead produce a custom greeting and adds another config format outside the approved JSON design. This review-fix workflow explicitly prohibits changing approved behavior, design, or scope.
- Disposition: unresolved. Return this request to the acceptance or planning workflow for an approved requirement/design update before finalization can continue. The current implementation preserves the approved missing-JSON fallback.

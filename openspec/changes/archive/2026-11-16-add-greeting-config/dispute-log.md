## PR comment: YAML fallback

- Number: 1.
- File: `src/config.ts`, line 15.
- Author: `pacaplan`.
- Comment: “Can this also read a greet.yaml file when greet.json is missing? Some of our users prefer YAML.”
- Request: add a second configuration format and fall back to it when greet.json is absent.
- Why not fixed: the approved “Default greeting without the file” requirement mandates `Hello, <name>!` whenever greet.json is absent, and the design reads only greet.json. Reading a custom greeting from greet.yaml in that situation changes approved behavior and expands the parser/config-format scope. The current workflow boundary forbids making that change as review feedback. The request must return to the acceptance or planning workflow before finalization can continue. No YAML parsing, dependency, or fallback was added; this thread remains unresolved.

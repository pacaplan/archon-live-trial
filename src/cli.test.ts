import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));
let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'greet-cli-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

test.each([
  ['custom greeting', 'Hi', 'Hi, Ada!\n'],
  ['no config file', undefined, 'Hello, Ada!\n'],
])('INT-001: %s', (_scenario, greeting, output) => {
  if (greeting !== undefined) {
    writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
  }
  const result = Bun.spawnSync([process.execPath, cli, 'Ada'], {
    cwd: dir,
    timeout: 10_000,
  });
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString()).toBe(output);
  expect(result.stderr.toString()).toBe('');
});

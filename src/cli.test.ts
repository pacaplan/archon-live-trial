import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cli = join(import.meta.dir, 'cli.ts');
let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'greet-cli-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function runCli() {
  return Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
}

test('INT-001: uses the config in the CLI working directory', () => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting: 'Hi' }));
  const result = runCli();
  expect(result.stdout.toString()).toBe('Hi, Ada!\n');
  expect(result.stderr.toString()).toBe('');
  expect(result.exitCode).toBe(0);
});

test('INT-001: defaults when the CLI working directory has no config', () => {
  const result = runCli();
  expect(result.stdout.toString()).toBe('Hello, Ada!\n');
  expect(result.stderr.toString()).toBe('');
  expect(result.exitCode).toBe(0);
});

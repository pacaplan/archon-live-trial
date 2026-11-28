import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let cwd: string;

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), 'greet-cli-'));
});

afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
});

function runGreet() {
  return Bun.spawnSync([process.execPath, join(import.meta.dir, 'cli.ts'), 'Ada'], {
    cwd,
  });
}

test('INT-001 custom greeting from the working directory', () => {
  writeFileSync(join(cwd, 'greet.json'), '{"greeting":"Hi"}');

  const result = runGreet();

  expect(result.stdout.toString()).toBe('Hi, Ada!\n');
  expect(result.exitCode).toBe(0);
});

test('INT-001 default greeting without a config file', () => {
  const result = runGreet();

  expect(result.stdout.toString()).toBe('Hello, Ada!\n');
  expect(result.exitCode).toBe(0);
});

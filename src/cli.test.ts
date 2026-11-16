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

function runCli(args: string[]) {
  return Bun.spawnSync([process.execPath, cli, ...args], { cwd: dir });
}

test('INT-001: CLI reads custom greeting from its working directory', () => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting: 'Hi' }));
  const result = runCli(['Ada']);
  expect(result.stdout.toString()).toBe('Hi, Ada!\n');
  expect(result.stderr.toString()).toBe('');
  expect(result.exitCode).toBe(0);
});

test('INT-001: CLI defaults when its working directory has no config', () => {
  const result = runCli(['Ada']);
  expect(result.stdout.toString()).toBe('Hello, Ada!\n');
  expect(result.stderr.toString()).toBe('');
  expect(result.exitCode).toBe(0);
});

test('CLI rejects a missing name', () => {
  const result = runCli([]);
  expect(result.stdout.toString()).toBe('');
  expect(result.stderr.toString()).toBe('usage: greet <name>\n');
  expect(result.exitCode).toBe(1);
});

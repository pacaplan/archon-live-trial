import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

test('INT-001: custom greeting from the CLI working directory', () => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting: 'Hi' }));
  const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
  expect(result.stdout.toString()).toBe('Hi, Ada!\n');
  expect(result.stderr.toString()).toBe('');
  expect(result.exitCode).toBe(0);
});

test('INT-001: default greeting without a config file', () => {
  const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
  expect(result.stdout.toString()).toBe('Hello, Ada!\n');
  expect(result.stderr.toString()).toBe('');
  expect(result.exitCode).toBe(0);
});

test.each([
  { label: 'missing greeting', value: {} },
  { label: 'numeric greeting', value: { greeting: 5 } },
  { label: 'null greeting', value: { greeting: null } },
  { label: 'top-level null', value: null },
])('CLI defaults to Hello for $label', ({ value }) => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify(value));
  const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
  expect(result.stdout.toString()).toBe('Hello, Ada!\n');
  expect(result.stderr.toString()).toBe('');
  expect(result.exitCode).toBe(0);
});

test('CLI reports invalid JSON and exits with failure', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
  expect(result.stdout.toString()).toBe('');
  expect(result.stderr.toString()).toContain('SyntaxError');
  expect(result.exitCode).toBe(1);
});

test('CLI reports filesystem errors and exits with failure', () => {
  mkdirSync(join(dir, 'greet.json'));
  const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
  expect(result.stdout.toString()).toBe('');
  expect(result.stderr.toString()).toContain('EISDIR');
  expect(result.exitCode).toBe(1);
});

import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readGreeting } from './config.ts';

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'greet-config-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

test('reads greeting synchronously from the supplied directory', () => {
  writeFileSync(join(dir, 'greet.json'), '{"greeting":"Hi"}');
  expect(readGreeting(dir)).toBe('Hi');
});

test('returns undefined for a missing config file', () => {
  expect(readGreeting(dir)).toBeUndefined();
});

test('propagates invalid JSON', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  expect(() => readGreeting(dir)).toThrow(SyntaxError);
});

import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

test('reads the greeting from the supplied directory', () => {
  writeFileSync(join(dir, 'greet.json'), '{"greeting":"Hi"}');
  expect(readGreeting(dir)).toBe('Hi');
  writeFileSync(join(dir, 'greet.json'), '{"greeting":""}');
  expect(readGreeting(dir)).toBe('');
});

test('returns undefined when greet.json is absent', () => {
  expect(readGreeting(dir)).toBeUndefined();
});

test('propagates malformed JSON', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  expect(() => readGreeting(dir)).toThrow(SyntaxError);
});

test('propagates read errors other than a missing file', () => {
  mkdirSync(join(dir, 'greet.json'));
  expect(() => readGreeting(dir)).toThrow();
});

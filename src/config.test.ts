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

test('reads the greeting from the supplied directory', () => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting: 'Hi' }));
  expect(readGreeting(dir)).toBe('Hi');
});

test('returns undefined when greet.json is missing', () => {
  expect(readGreeting(dir)).toBeUndefined();
});

test('preserves an empty string greeting', () => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting: '' }));
  expect(readGreeting(dir)).toBe('');
});

test('does not swallow invalid JSON', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  expect(() => readGreeting(dir)).toThrow(SyntaxError);
});

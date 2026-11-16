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

test.each([
  { label: 'missing greeting', value: {} },
  { label: 'numeric greeting', value: { greeting: 5 } },
  { label: 'null greeting', value: { greeting: null } },
  { label: 'boolean greeting', value: { greeting: false } },
  { label: 'object greeting', value: { greeting: {} } },
  { label: 'array greeting', value: { greeting: [] } },
  { label: 'top-level null', value: null },
  { label: 'top-level number', value: 5 },
  { label: 'top-level string', value: 'Hi' },
  { label: 'top-level boolean', value: true },
  { label: 'top-level array', value: [] },
])('returns undefined for $label', ({ value }) => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify(value));
  expect(readGreeting(dir)).toBeUndefined();
});

test('does not swallow invalid JSON', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  expect(() => readGreeting(dir)).toThrow(SyntaxError);
});

test('does not swallow filesystem errors other than ENOENT', () => {
  mkdirSync(join(dir, 'greet.json'));
  expect(() => readGreeting(dir)).toThrow();
});

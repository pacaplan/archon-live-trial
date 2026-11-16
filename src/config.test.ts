import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
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

test('reads the string greeting from the supplied directory', () => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting: 'Hi' }));
  expect(readGreeting(dir)).toBe('Hi');
});

test('returns undefined when greet.json is absent', () => {
  expect(readGreeting(dir)).toBeUndefined();
});

test('preserves an empty string greeting', () => {
  writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting: '' }));
  expect(readGreeting(dir)).toBe('');
});

test('returns undefined without a string greeting', () => {
  for (const config of [{}, { greeting: 42 }, null]) {
    writeFileSync(join(dir, 'greet.json'), JSON.stringify(config));
    expect(readGreeting(dir)).toBeUndefined();
  }
});

test('propagates malformed JSON', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  expect(() => readGreeting(dir)).toThrow(SyntaxError);
});

test('propagates filesystem errors other than a missing file', () => {
  mkdirSync(join(dir, 'greet.json'));
  expect(() => readGreeting(dir)).toThrow();
});

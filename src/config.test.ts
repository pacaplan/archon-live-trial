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

test('I-1: reads configured strings including an empty string', () => {
  for (const greeting of ['Hi', 'Welcome', '']) {
    writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
    expect(readGreeting(dir)).toBe(greeting);
  }
});

test('I-2: returns undefined when greet.json is absent', () => {
  expect(readGreeting(dir)).toBeUndefined();
});

test('propagates malformed JSON errors', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  expect(() => readGreeting(dir)).toThrow(SyntaxError);
});

test('propagates filesystem errors other than a missing file', () => {
  mkdirSync(join(dir, 'greet.json'));
  expect(() => readGreeting(dir)).toThrow();
});

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

test('reads a string greeting', () => {
  writeFileSync(join(dir, 'greet.json'), '{"greeting":"Hi"}');
  expect(readGreeting(dir)).toBe('Hi');
});

test('returns undefined when greet.json is absent', () => {
  expect(readGreeting(dir)).toBeUndefined();
});

test('reports the config path and original syntax error for malformed JSON', () => {
  const path = join(dir, 'greet.json');
  writeFileSync(path, '{"greeting":"Hi",}');

  expect(() => readGreeting(dir)).toThrow(
    expect.objectContaining({
      name: 'SyntaxError',
      message: expect.stringContaining(`Invalid JSON in ${path}:`),
      cause: expect.any(SyntaxError),
    }),
  );
});

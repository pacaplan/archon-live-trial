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

test('returns undefined when the greeting field is absent', () => {
  writeFileSync(join(dir, 'greet.json'), '{}');
  expect(readGreeting(dir)).toBeUndefined();
});

test.each(['null', '[]', '5', '"Hi"', 'true'])(
  'rejects a non-object config: %s', (contents) => {
    writeFileSync(join(dir, 'greet.json'), contents);
    expect(() => readGreeting(dir)).toThrow(`${join(dir, 'greet.json')}: expected a JSON object`);
  },
);

test.each([null, 5, {}, [], false].map((greeting) => [greeting]))(
  'rejects a non-string greeting: %j', (greeting) => {
    writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
    expect(() => readGreeting(dir)).toThrow(`${join(dir, 'greet.json')}: "greeting" must be a string`);
  },
);

test('reports malformed JSON with the config path and original cause', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  let thrown: unknown;
  try {
    readGreeting(dir);
  } catch (error) {
    thrown = error;
  }
  expect(thrown).toMatchObject({
    message: `Invalid JSON in ${join(dir, 'greet.json')}`,
    cause: expect.any(SyntaxError),
  });
});

test('reports read errors with the config path and original cause', () => {
  mkdirSync(join(dir, 'greet.json'));
  let thrown: unknown;
  try {
    readGreeting(dir);
  } catch (error) {
    thrown = error;
  }
  expect(thrown).toMatchObject({
    message: `Failed to read ${join(dir, 'greet.json')}`,
    cause: expect.objectContaining({ code: 'EISDIR' }),
  });
});

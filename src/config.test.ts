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
  for (const greeting of ['Hi', 'Welcome', '']) {
    writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
    expect(readGreeting(dir)).toBe(greeting);
  }
});

test('returns undefined when greet.json is missing', () => {
  expect(readGreeting(dir)).toBeUndefined();
});

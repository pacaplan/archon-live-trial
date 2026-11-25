import { expect, test } from 'bun:test';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readGreeting } from './config.ts';
import { withTempDir } from './test-fixtures.ts';

test('readGreeting returns strings or undefined for a missing file', () => {
  withTempDir((dir) => {
    const configPath = join(dir, 'greet.json');
    expect(readGreeting(dir)).toBeUndefined();

    writeFileSync(configPath, JSON.stringify({ greeting: 'Hi', ignored: true }));
    expect(readGreeting(dir)).toBe('Hi');

    writeFileSync(configPath, JSON.stringify({ greeting: '' }));
    expect(readGreeting(dir)).toBe('');
  });
});

test('readGreeting rejects malformed JSON and invalid greeting fields', () => {
  withTempDir((dir) => {
    const configPath = join(dir, 'greet.json');
    writeFileSync(configPath, '{');
    expect(() => readGreeting(dir)).toThrow(SyntaxError);

    for (const config of [null, {}, { greeting: 42 }]) {
      writeFileSync(configPath, JSON.stringify(config));
      expect(() => readGreeting(dir)).toThrow('greet.json must contain a string greeting');
    }
  });
});

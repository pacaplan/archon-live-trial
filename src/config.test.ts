import { expect, test } from 'bun:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readGreeting } from './config.ts';
import { withTempDir } from './test-fixtures.ts';

test('readGreeting returns strings or undefined when the file or field is missing', () => {
  withTempDir((dir) => {
    const configPath = join(dir, 'greet.json');
    expect(readGreeting(dir)).toBeUndefined();

    writeFileSync(configPath, '{}');
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
    assert.throws(() => readGreeting(dir), (error: unknown) => {
      assert.ok(error instanceof SyntaxError);
      expect(error.message).toContain(`Invalid JSON in ${configPath}`);
      expect(error.cause).toBeInstanceOf(SyntaxError);
      return true;
    });

    for (const config of [null, [], { greeting: null }, { greeting: 42 }]) {
      writeFileSync(configPath, JSON.stringify(config));
      expect(() => readGreeting(dir)).toThrow('greet.json must contain a string greeting');
    }
  });
});

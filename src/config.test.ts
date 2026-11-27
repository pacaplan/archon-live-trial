import { expect, spyOn, test } from 'bun:test';
import fs from 'node:fs';
import { join } from 'node:path';
import { readGreeting } from './config.ts';

test('malformed config errors name the file and preserve the parse error', () => {
  const dir = '/workspace';
  const readFile = spyOn(fs, 'readFileSync').mockReturnValue('{"greeting":');

  try {
    expect.assertions(3);
    try {
      readGreeting(dir);
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
      expect((error as Error).message).toContain(join(dir, 'greet.json'));
      expect((error as Error).cause).toBeInstanceOf(SyntaxError);
    }
  } finally {
    readFile.mockRestore();
  }
});

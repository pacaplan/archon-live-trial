import { expect, test } from 'bun:test';
import assert, { AssertionError } from 'node:assert/strict';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { withTempDir } from './test-fixtures.ts';

test.each([
  ['success', undefined],
  ['an assertion failure', new AssertionError({ message: 'fixture assertion failed' })],
] as const)('withTempDir removes fixtures after %s', (_outcome, failure) => {
  let fixtureDir: string | undefined;
  const run = () => withTempDir((dir) => {
    fixtureDir = dir;
    writeFileSync(join(dir, 'fixture.txt'), 'fixture');
    if (failure) {
      assert.fail(failure);
    }
  });

  try {
    if (failure) {
      assert.throws(run, (error) => error === failure);
    } else {
      run();
    }

    assert.ok(fixtureDir);
    expect(existsSync(fixtureDir)).toBe(false);
  } finally {
    if (fixtureDir !== undefined) {
      rmSync(fixtureDir, { recursive: true, force: true });
    }
  }
});

import { expect, test } from 'bun:test';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { withTempDir } from './test-fixtures.ts';

test.each([
  ['custom greeting', { greeting: 'Hi' }, 'Hi, Ada!\n'],
  ['default greeting', undefined, 'Hello, Ada!\n'],
  ['default greeting for an empty config object', {}, 'Hello, Ada!\n'],
])('INT-001 prints the %s from the working directory', (_scenario, config, stdout) => {
  withTempDir((dir) => {
    if (config !== undefined) {
      writeFileSync(join(dir, 'greet.json'), JSON.stringify(config));
    }

    const result = Bun.spawnSync([process.execPath, join(import.meta.dir, 'cli.ts'), 'Ada'], {
      cwd: dir,
      stdout: 'pipe',
      stderr: 'pipe',
    });
    expect(result.stdout.toString()).toBe(stdout);
    expect(result.exitCode).toBe(0);
  });
});

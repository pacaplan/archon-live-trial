import { expect, test } from 'bun:test';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { withTempDir } from './test-fixtures.ts';

test.each([
  ['custom', 'Hi', 'Hi, Ada!\n'],
  ['default', undefined, 'Hello, Ada!\n'],
])('INT-001 prints the %s greeting from the working directory', (_scenario, greeting, stdout) => {
  withTempDir((dir) => {
    if (greeting !== undefined) {
      writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
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

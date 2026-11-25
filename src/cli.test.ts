import { expect, test } from 'bun:test';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { withTempDir } from './test-fixtures.ts';

function runCli(dir: string, ...args: string[]) {
  return Bun.spawnSync([process.execPath, join(import.meta.dir, 'cli.ts'), ...args], {
    cwd: dir,
    stdout: 'pipe',
    stderr: 'pipe',
  });
}

test.each([
  ['custom greeting', { greeting: 'Hi' }, 'Hi, Ada!\n'],
  ['default greeting', undefined, 'Hello, Ada!\n'],
  ['default greeting for an empty config object', {}, 'Hello, Ada!\n'],
])('INT-001 prints the %s from the working directory', (_scenario, config, stdout) => {
  withTempDir((dir) => {
    if (config !== undefined) {
      writeFileSync(join(dir, 'greet.json'), JSON.stringify(config));
    }

    const result = runCli(dir, 'Ada');
    expect(result.stdout.toString()).toBe(stdout);
    expect(result.exitCode).toBe(0);
  });
});

test('CLI prints usage to standard error when a name is missing', () => {
  withTempDir((dir) => {
    const result = runCli(dir);
    expect(result.stdout.toString()).toBe('');
    expect(result.stderr.toString()).toBe('usage: greet NAME\n');
    expect(result.exitCode).toBe(1);
  });
});

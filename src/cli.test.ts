import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cli = join(import.meta.dir, 'cli.ts');
let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'greet-cli-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

for (const greeting of ['Hi', undefined]) {
  test(`INT-001: CLI uses working directory with ${greeting === undefined ? 'no config' : 'custom config'}`, () => {
    if (greeting !== undefined) {
      writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
    }
    const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toBe(`${greeting ?? 'Hello'}, Ada!\n`);
    expect(result.stderr.toString()).toBe('');
  });
}

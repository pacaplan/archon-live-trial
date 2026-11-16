import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('./cli.ts', import.meta.url));
let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'greet-cli-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

test('INT-001: CLI reads configuration from its working directory', () => {
  for (const greeting of [undefined, 'Hi']) {
    if (greeting !== undefined) {
      writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
    }
    const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd: dir });
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toBe(`${greeting ?? 'Hello'}, Ada!\n`);
    expect(result.stderr.toString()).toBe('');
  }
});

test('CLI requires a name', () => {
  const result = Bun.spawnSync([process.execPath, cli], { cwd: dir });
  expect(result.exitCode).toBe(1);
  expect(result.stdout.toString()).toBe('');
  expect(result.stderr.toString()).toBe('usage: greet <name>\n');
});

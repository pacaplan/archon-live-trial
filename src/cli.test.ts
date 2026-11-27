import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cli = join(import.meta.dir, 'cli.ts');

describe('INT-001: The CLI reads greet.json from its working directory', () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), 'greet-'));
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  function expectGreeting(expected: string) {
    const result = Bun.spawnSync([process.execPath, cli, 'Ada'], { cwd });

    expect(result.stdout.toString()).toBe(`${expected}\n`);
    expect(result.exitCode).toBe(0);
  }

  test('prints the configured greeting', () => {
    writeFileSync(join(cwd, 'greet.json'), JSON.stringify({ greeting: 'Hi' }));

    expectGreeting('Hi, Ada!');
  });

  test('prints the default when greet.json is absent', () => {
    expectGreeting('Hello, Ada!');
  });
});

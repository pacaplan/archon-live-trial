import { afterEach, beforeEach, expect, mock, spyOn, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { main } from './cli.ts';

let dir: string;
let output: ReturnType<typeof spyOn>;
let errors: ReturnType<typeof spyOn>;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'greet-cli-unit-'));
  output = spyOn(console, 'log').mockImplementation(() => {});
  errors = spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  mock.restore();
  rmSync(dir, { recursive: true, force: true });
});

test('R2: main returns success with custom, empty, and default greetings', () => {
  expect(main('Ada', dir)).toBe(0);
  expect(output).toHaveBeenLastCalledWith('Hello, Ada!');
  for (const greeting of ['Hi', '']) {
    writeFileSync(join(dir, 'greet.json'), JSON.stringify({ greeting }));
    expect(main('Ada', dir)).toBe(0);
    expect(output).toHaveBeenLastCalledWith(`${greeting}, Ada!`);
  }
  expect(errors).not.toHaveBeenCalled();
});

for (const contents of ['{', 'null', '{"greeting":5}']) {
  test(`R2: main reports invalid config ${contents} without a stack trace`, () => {
    writeFileSync(join(dir, 'greet.json'), contents);
    expect(main('Ada', dir)).toBe(1);
    expect(output).not.toHaveBeenCalled();
    expect(errors).toHaveBeenCalledTimes(1);
    const message = errors.mock.calls[0][0] as string;
    expect(message).toStartWith(`greet: failed to load ${join(dir, 'greet.json')}: `);
    expect(message).toContain(join(dir, 'greet.json'));
    expect(message).not.toContain('\n');
  });
}

test('R2: main reports filesystem failures without a stack trace', () => {
  mkdirSync(join(dir, 'greet.json'));
  expect(main('Ada', dir)).toBe(1);
  expect(output).not.toHaveBeenCalled();
  expect(errors).toHaveBeenCalledTimes(1);
  const message = errors.mock.calls[0][0] as string;
  expect(message).toStartWith(`greet: failed to load ${join(dir, 'greet.json')}: `);
  expect(message).toContain(join(dir, 'greet.json'));
  expect(message).not.toContain('\n');
});

test('R2: main preserves usage failure before config loading', () => {
  writeFileSync(join(dir, 'greet.json'), '{');
  expect(main(undefined, dir)).toBe(1);
  expect(errors).toHaveBeenCalledTimes(1);
  expect(errors).toHaveBeenCalledWith('usage: greet <name>');
  expect(output).not.toHaveBeenCalled();
});

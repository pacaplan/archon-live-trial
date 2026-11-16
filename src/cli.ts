#!/usr/bin/env bun
import { greet } from './greet.ts';
import { readGreeting } from './config.ts';
import { join } from 'node:path';

export function main(name: string | undefined, dir: string): number {
  if (!name) {
    console.error('usage: greet <name>');
    return 1;
  }
  try {
    console.log(greet(name, readGreeting(dir)));
    return 0;
  } catch (error) {
    console.error(`greet: failed to load ${join(dir, 'greet.json')}: ${(error as Error).message}`);
    return 1;
  }
}

if (import.meta.main) {
  process.exitCode = main(process.argv[2], process.cwd());
}

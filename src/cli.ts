#!/usr/bin/env bun
import { readGreeting } from './config.ts';
import { greet } from './greet.ts';

const name = process.argv[2];
if (!name) {
  console.error('usage: greet NAME');
  process.exit(1);
}
console.log(greet(name, readGreeting(process.cwd())));

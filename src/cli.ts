#!/usr/bin/env bun
import { greet } from './greet.ts';
import { readGreeting } from './config.ts';

const name = process.argv[2];
if (!name) {
  console.error('usage: greet <name>');
  process.exit(1);
}
console.log(greet(name, readGreeting(process.cwd())));

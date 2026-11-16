#!/usr/bin/env bun
import { greet } from './greet.ts';
import { readGreeting } from './config.ts';

const name = process.argv[2];
if (!name) {
  console.error('usage: greet <name>');
  process.exit(1);
}
try {
  console.log(greet(name, readGreeting(process.cwd())));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message.replace(/[\r\n]+/g, ' '));
  process.exit(1);
}

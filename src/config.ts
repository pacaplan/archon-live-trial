import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  const path = join(dir, 'greet.json');
  let contents: string;
  try {
    contents = readFileSync(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch (error) {
    throw new SyntaxError(`Invalid JSON in ${path}: ${(error as Error).message}`, { cause: error });
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${path}: expected a JSON object`);
  }
  const greeting = (parsed as Record<string, unknown>).greeting;
  if (greeting !== undefined && typeof greeting !== 'string') {
    throw new Error(`${path}: "greeting" must be a string`);
  }
  return greeting;
}

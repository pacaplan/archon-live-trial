import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  const file = join(dir, 'greet.json');
  let contents: string;
  try {
    contents = readFileSync(file, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw new Error(`Failed to read ${file}: ${String(error)}`, { cause: error });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch (error) {
    throw new Error(`Invalid JSON in ${file}: ${String(error)}`, { cause: error });
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${file}: expected a JSON object`);
  }
  const greeting = (parsed as { greeting?: unknown }).greeting;
  if (greeting !== undefined && typeof greeting !== 'string') {
    throw new Error(`${file}: "greeting" must be a string`);
  }
  return greeting;
}

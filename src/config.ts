import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  const file = join(dir, 'greet.json');
  let contents: string;
  try {
    contents = readFileSync(file, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
  const parsed: unknown = JSON.parse(contents);
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${file}: expected a JSON object`);
  }
  const greeting = (parsed as { greeting?: unknown }).greeting;
  if (greeting !== undefined && typeof greeting !== 'string') {
    throw new Error(`${file}: "greeting" must be a string`);
  }
  return greeting;
}

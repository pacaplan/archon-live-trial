import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  let contents: string;
  try {
    contents = readFileSync(join(dir, 'greet.json'), 'utf8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  const greeting: unknown = JSON.parse(contents)?.greeting;
  return typeof greeting === 'string' ? greeting : undefined;
}

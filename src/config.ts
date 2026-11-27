import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  let contents: string;
  try {
    contents = readFileSync(join(dir, 'greet.json'), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  const config = JSON.parse(contents) as { greeting?: unknown } | null;
  const greeting = config?.greeting;
  return typeof greeting === 'string' ? greeting : undefined;
}

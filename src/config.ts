import fs from 'node:fs';
import { join } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  const path = join(dir, 'greet.json');
  let contents: string;
  try {
    contents = fs.readFileSync(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  let config: { greeting?: unknown } | null;
  try {
    config = JSON.parse(contents) as { greeting?: unknown } | null;
  } catch (error) {
    throw new SyntaxError(`Invalid JSON in ${path}: ${(error as Error).message}`, { cause: error });
  }

  const greeting = config?.greeting;
  return typeof greeting === 'string' ? greeting : undefined;
}

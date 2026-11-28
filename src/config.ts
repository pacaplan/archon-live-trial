import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  const path = join(dir, 'greet.json');
  let contents: string;
  try {
    contents = readFileSync(path, 'utf8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  let config: { greeting?: unknown } | null;
  try {
    config = JSON.parse(contents);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(`Invalid JSON in ${path}: ${error.message}`, { cause: error });
    }
    throw error;
  }

  const greeting = config?.greeting;
  return typeof greeting === 'string' ? greeting : undefined;
}

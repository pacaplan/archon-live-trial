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

  const config: unknown = JSON.parse(contents);
  if (config && typeof config === 'object' && 'greeting' in config && typeof config.greeting === 'string') {
    return config.greeting;
  }
  throw new Error('greet.json must contain a string greeting');
}

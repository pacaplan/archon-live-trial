import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function readGreeting(dir: string): string | undefined {
  const configPath = resolve(dir, 'greet.json');
  let contents: string;
  try {
    contents = readFileSync(configPath, 'utf8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  let config: unknown;
  try {
    config = JSON.parse(contents);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new SyntaxError(`Invalid JSON in ${configPath}: ${detail}`, { cause: error });
  }

  if (config && typeof config === 'object' && !Array.isArray(config)) {
    if (!('greeting' in config)) {
      return undefined;
    }
    if (typeof config.greeting === 'string') {
      return config.greeting;
    }
  }
  throw new Error('greet.json must contain a string greeting');
}

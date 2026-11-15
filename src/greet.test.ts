import { expect, test } from 'bun:test';
import { greet } from './greet.ts';

test('greets by name', () => {
  expect(greet('Ada')).toBe('Hello, Ada!');
});

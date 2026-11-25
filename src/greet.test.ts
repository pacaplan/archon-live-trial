import { expect, test } from 'bun:test';
import { greet } from './greet.ts';

test('greet formats custom greetings and defaults to Hello', () => {
  expect(greet('Ada')).toBe('Hello, Ada!');
  expect(greet('Ada', undefined)).toBe('Hello, Ada!');
  expect(greet('Ada', 'Hi')).toBe('Hi, Ada!');
  expect(greet('Ada', '')).toBe(', Ada!');
});

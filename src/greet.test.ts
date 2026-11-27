import { expect, test } from 'bun:test';
import { greet } from './greet.ts';

test('greets by name', () => {
  expect(greet('Ada')).toBe('Hello, Ada!');
});

test('greets with the supplied greeting', () => {
  expect(greet('Ada', 'Welcome')).toBe('Welcome, Ada!');
  expect(greet('Ada', '')).toBe(', Ada!');
});

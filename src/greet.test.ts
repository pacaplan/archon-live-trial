import { expect, test } from 'bun:test';
import { greet } from './greet.ts';

test('greets by name', () => {
  expect(greet('Ada')).toBe('Hello, Ada!');
});

test('uses an explicit greeting', () => {
  expect(greet('Ada', 'Hi')).toBe('Hi, Ada!');
  expect(greet('Ada', '')).toBe(', Ada!');
});

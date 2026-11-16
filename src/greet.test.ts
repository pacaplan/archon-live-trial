import { expect, test } from 'bun:test';
import { greet } from './greet.ts';

test('greets by name', () => {
  expect(greet('Ada')).toBe('Hello, Ada!');
});

test('uses the supplied greeting', () => {
  expect(greet('Ada', 'Hi')).toBe('Hi, Ada!');
  expect(greet('Ada', '')).toBe(', Ada!');
});

test('uses the default greeting for undefined', () => {
  expect(greet('Ada', undefined)).toBe('Hello, Ada!');
});

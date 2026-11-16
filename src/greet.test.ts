import { expect, test } from 'bun:test';
import { greet } from './greet.ts';

test('greets by name', () => {
  expect(greet('Ada')).toBe('Hello, Ada!');
});

test('I-1: formats custom greetings including an empty string', () => {
  expect(greet('Ada', 'Hi')).toBe('Hi, Ada!');
  expect(greet('Ada', '')).toBe(', Ada!');
});

test('I-2: defaults omitted and undefined greetings', () => {
  expect(greet('Ada')).toBe('Hello, Ada!');
  expect(greet('Ada', undefined)).toBe('Hello, Ada!');
});

import { render, screen } from '@testing-library/react';

test('jest', () => {
  render(<a>hello</a>);
  expect(screen.getByText('hello')).toHaveTextContent('hello');
});

test('is', () => {
  expect(1).toBe(1);
});

test('working', () => {
  expect(true).toBe(true);
});

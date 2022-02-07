import { render, screen } from '@testing-library/react';

test('jest is working fine!', () => {
  render(<a>hello</a>);
  expect(screen.getByText('hello')).toHaveTextContent('hello');
});

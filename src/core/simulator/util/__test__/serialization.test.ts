import { SerializedCustomGate, fetchSavedGates } from '../serialization';

beforeEach(() => {
  localStorage.clear();
});

test('Fetches saved gates from localstorage correctly', () => {
  const expected: SerializedCustomGate = {
    color: '#fff',
    inputs: [
      {
        id: '1',
        connections: []
      }
    ],
    gates: [],
    outputs: []
  };
  localStorage.setItem('saved-gates', JSON.stringify({ expected }));

  expect(fetchSavedGates).not.toThrow();

  const result = fetchSavedGates();
  expect(result.expected).toBeDefined();
  expect(JSON.stringify(result.expected)).toEqual(JSON.stringify(expected));
});

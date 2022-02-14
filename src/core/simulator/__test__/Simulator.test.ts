import { Simulator } from '../Simulator';

describe('Simulator works properly', () => {
  let simulator: Simulator;

  beforeEach(() => {
    simulator = new Simulator();
  });

  test('Adds a new input gate properly', () => {
    simulator.add('input');
    expect(simulator.circuit.inputs.size).toEqual(1);
  });

  test('Adds a new gate properly', () => {
    simulator.add('not');
    expect(simulator.circuit.gates.size).toEqual(1);
  });

  test('Adds a new output properly', () => {
    simulator.add('output');
    expect(simulator.circuit.outputs.size).toEqual(1);
  });

  test('Removes an element from the circuit properly', () => {
    const a = simulator.add('input');
    const b = simulator.add('input');
    const c = simulator.add('and');
    const d = simulator.add('output');
    simulator.toggleInput(a);
    simulator.toggleInput(b);

    simulator.remove(c);

    expect(simulator.circuit.find(c)).toBeUndefined();
    expect(simulator.circuit.find(a)?.connections.length).toEqual(0);
    expect(simulator.circuit.find(b)?.connections.length).toEqual(0);
    expect(simulator.circuit.find(d)?.states[0] && simulator.circuit.find(d)?.inputs[0]).toEqual(false);
  });
});

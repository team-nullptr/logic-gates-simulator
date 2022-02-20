import { Simulator } from '../Simulator';
import { Gate } from '../elements/Gate';

describe('Simulator works properly', () => {
  let simulator: Simulator;

  beforeEach(() => {
    simulator = new Simulator();
  });

  test('Adds a new input gate properly', () => {
    simulator.addPort('input');
    expect(simulator.circuit.inputs.size).toEqual(1);
  });

  test('Adds a new gate properly', () => {
    simulator.addGate('not');
    expect(simulator.circuit.gates.size).toEqual(1);
  });

  test('Adds a new output properly', () => {
    simulator.addPort('output');
    expect(simulator.circuit.outputs.size).toEqual(1);
  });

  test('Removes an element from the circuit properly', () => {
    const a = simulator.addPort('input');
    const b = simulator.addPort('input');
    const c = simulator.addGate('and');
    const d = simulator.addPort('output');

    simulator.remove(c);

    expect(simulator.circuit.find(c)).toBeUndefined();
    expect(simulator.circuit.find(a)?.connections.length).toEqual(0);
    expect(simulator.circuit.find(b)?.connections.length).toEqual(0);
    expect(simulator.circuit.find(d)?.states[0] && (simulator.circuit.find(d) as Gate).inputs[0]).toEqual(false);
  });
});

import { Circuit, SerializedCircuit } from '../Circuit';
import { BaseGate } from '../elements/BaseGate';
import { baseGates } from '../elements/ElementFactory';
import { Element } from '../elements/Element';
import { SerializedCustomGate } from '../elements/CustomGate';

test('Serializes circuit properly', () => {
  const circuit = new Circuit();
  circuit.inputs.set('1', new Element('1', 'input'));
  circuit.gates.set('2', new BaseGate('2', baseGates.get('not')!));
  circuit.outputs.set('3', new Element('3', 'output'));

  const expected: SerializedCircuit = {
    inputs: [{ id: '1', type: 'input', connections: [] }],
    gates: [{ id: '2', type: 'not', connections: [] }],
    outputs: [{ id: '3' }]
  };

  const serialized = circuit.serialize();

  expect(JSON.stringify(serialized)).toEqual(JSON.stringify(expected));
});

test('Deserializes circuit properly', () => {
  const circuit = new Circuit();

  const serialized: SerializedCircuit = {
    inputs: [
      { id: '1', type: 'input', connections: [] },
      { id: '2', type: 'input', connections: [] }
    ],
    gates: [{ id: '3', type: 'not', connections: [] }],
    outputs: [{ id: '4' }]
  };

  const createdGates = new Map<string, SerializedCustomGate>();

  circuit.deserialize(serialized, createdGates);

  expect(circuit.inputs.size).toEqual(2);
  expect(circuit.gates.size).toEqual(1);
  expect(circuit.outputs.size).toEqual(1);

  expect(circuit.inputs.has('1')).toBeTruthy();
  expect(circuit.gates.has('3')).toBeTruthy();
  expect(circuit.outputs.has('4')).toBeTruthy();

  expect(circuit.inputs.get('1')?.type).toBe('input');
  expect(circuit.gates.get('3')?.type).toBe('not');
});

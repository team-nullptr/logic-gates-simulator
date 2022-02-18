import { Circuit, SerializedCircuit } from '../Circuit';
import { ElementFactory } from '../elements/ElementFactory';
import { SerializedCustomGate } from '../elements/CustomGate';

test('Serializes circuit properly', () => {
  const circuit = new Circuit();
  circuit.inputs.set('1', ElementFactory.createPort('1', 'input', 1));
  circuit.gates.set('2', ElementFactory.createBaseGate('2', 'not'));
  circuit.outputs.set('3', ElementFactory.createPort('3', 'output', 1));

  const expected: SerializedCircuit = {
    inputs: [{ id: '1', type: 'input', connectors: 1, connections: [] }],
    gates: [{ id: '2', type: 'not', connections: [] }],
    outputs: [{ id: '3', type: 'output', connectors: 1 }]
  };

  const serialized = circuit.serialize();

  expect(serialized).toEqual(expected);
});

test('Deserializes circuit properly', () => {
  const serialized: SerializedCircuit = {
    inputs: [
      { id: '1', type: 'input', connectors: 1, connections: [] },
      { id: '2', type: 'input', connectors: 1, connections: [] }
    ],
    gates: [{ id: '3', type: 'not', connections: [] }],
    outputs: [{ id: '4', type: 'output', connectors: 1 }]
  };

  const createdGates = new Map<string, SerializedCustomGate>();
  const circuit = Circuit.deserialize(serialized, createdGates);

  expect(circuit.inputs.size).toEqual(serialized.inputs.length);
  expect(circuit.gates.size).toEqual(serialized.gates.length);
  expect(circuit.outputs.size).toEqual(serialized.outputs.length);

  expect(circuit.inputs.has('1')).toBeTruthy();
  expect(circuit.gates.has('3')).toBeTruthy();
  expect(circuit.outputs.has('4')).toBeTruthy();

  expect(circuit.inputs.get(serialized.inputs[0].id)?.type).toEqual(serialized.inputs[0].type);
  expect(circuit.gates.get(serialized.gates[0].id)?.type).toEqual(serialized.gates[0].type);
  expect(circuit.outputs.get(serialized.outputs[0].id)?.type).toEqual(serialized.outputs[0].type);
});

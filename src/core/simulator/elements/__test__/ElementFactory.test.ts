import { baseGates, ElementFactory } from '../ElementFactory';
import { SerializedCustomGate } from '../CustomGate';
import { PortType } from '../Port';

describe('Element factory creates elements properly', () => {
  test.each([
    { type: 'input', connectors: 1 },
    { type: 'output', connectors: 4 }
  ])('Creates port of type %i properly', ({ type, connectors }) => {
    const id = '1';

    const input = ElementFactory.createPort(id, type as PortType, connectors);

    expect(input.id).toEqual(id);
    expect(input.type).toEqual(type);
    expect(input.states).toEqual(new Array(connectors).fill(false));
    expect(input.connections).toEqual([]);
  });

  test('Creates base gate properly', () => {
    const id = '1';
    const options = baseGates.get('not');

    const gate = ElementFactory.createBaseGate(id, 'not');

    expect(gate.id).toEqual(id);
    expect(gate.type).toEqual('not');
    expect(gate.color).toEqual(options?.color);
    expect(gate.inputs).toEqual(new Array(options?.inputsCount).fill(false));
    expect(gate.connections).toEqual([]);
  });

  test('Creates custom gate properly', () => {
    const id = '1';
    const createdGates: Map<string, SerializedCustomGate> = new Map<string, SerializedCustomGate>([
      [
        'custom',
        {
          type: 'circuit',
          color: '#ffddff',
          name: 'test',
          dependencies: [],
          circuit: {
            inputs: [{ id: '1', name: '', connectors: 1, connections: [{ receiverId: '2', from: 0, to: 0 }] }],
            gates: [{ id: '2', type: 'not', connections: [{ receiverId: '3', from: 0, to: 0 }] }],
            outputs: [{ id: '3', name: '', connectors: 1 }]
          }
        }
      ]
    ]);

    const gate = ElementFactory.createCustomGate(id, 'custom', createdGates);

    expect(gate.id).toEqual(id);
    expect(gate.inputsNames).toEqual(['']);
    expect(gate.outputsNames).toEqual(['']);
    expect(gate.inputs.length).toEqual(1);
    expect(gate.circuit.gates.get('2')?.type).toEqual('not');
    expect(gate.inputs.length).toEqual(1);
    expect(gate.dependencies.size).toEqual(0);
  });
});

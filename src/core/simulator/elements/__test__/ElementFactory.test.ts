import { baseGates, ElementFactory, InputType } from '../ElementFactory';
import { SerializedCustomGate } from '../CustomGate';

describe('Element factory creates gates properly', () => {
  test.each(['input', 'input-group'] as InputType[])('Creates input element of type %i properly', (type) => {
    const id = '1';

    const input = ElementFactory.createInput(id, type);

    expect(input.id).toEqual(id);
    expect(input.type).toEqual(type);
    expect(input.states).toEqual([false]);
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

  // TODO: Test creating custom gate
  test('Creates custom gate properly', () => {
    const id = '1';
    const createdGates: Map<string, SerializedCustomGate> = new Map<string, SerializedCustomGate>([
      [
        'custom',
        {
          type: 'circuit',
          color: '#ffddff',
          circuit: {
            inputs: [{ id: '1', type: 'input', connections: [{ receiverId: '2', from: 0, to: 0 }] }],
            gates: [{ id: '2', type: 'not', connections: [{ receiverId: '3', from: 0, to: 0 }] }],
            outputs: [{ id: '3' }]
          }
        }
      ]
    ]);

    const gate = ElementFactory.createCustomGate(id, 'custom', createdGates);

    expect(gate.id).toEqual(id);
    expect(gate.inputs.length).toEqual(1);
    expect(gate.circuit.gates.get('2')?.type).toEqual('not');
    expect(gate.inputs.length).toEqual(1);
  });

  test('Creates output element properly', () => {
    const id = '1';

    const output = ElementFactory.createOutput(id);

    expect(output.id).toEqual(id);
    expect(output.inputs).toEqual([false]);
    expect(output.states).toEqual([false]);
    expect(output.connections).toEqual([]);
  });
});

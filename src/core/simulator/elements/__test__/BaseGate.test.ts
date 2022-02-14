import { BaseGate, BaseGateType, BaseGateOptions } from '../BaseGate';
import { baseGates } from '../ElementFactory';

describe('Base gates are setup correctly', () => {
  test.each(['not', 'or', 'and'] as BaseGateType[])('Base gate %s is defined', (type) => {
    const gate = baseGates.get(type);
    expect(gate).toBeDefined();
  });
});

test('Creates base gate correctly', () => {
  const id = '1';
  const handlerOutput = true;
  const options: BaseGateOptions = {
    type: 'test',
    color: '#000',
    inputsCount: 3,
    handler: () => handlerOutput
  };

  const gate = new BaseGate(id, options);
  gate.run();

  expect(gate.id).toEqual(id);
  expect(gate.connections).toEqual([]);
  expect(gate.states[0]).toEqual(handlerOutput);
  expect(gate.color).toEqual(options.color);
  expect(gate.inputs.length).toEqual(options.inputsCount);
  expect(gate.type).toEqual(options.type);
});

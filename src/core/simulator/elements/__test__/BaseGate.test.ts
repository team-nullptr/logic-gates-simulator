import { BaseGate, BaseGateType, BaseGateOptions } from '../BaseGate';
import { baseGates } from '../ElementFactory';

describe('Base gates are setup correctly', () => {
  test.each(['not', 'or', 'and'] as BaseGateType[])('Base gate %s is defined', (type) => {
    const gate = baseGates.get(type);
    expect(gate).toBeDefined();
  });
});

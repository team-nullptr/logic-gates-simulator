import { BaseGateType } from '../BaseGate';
import { baseGates } from '../ElementFactory';

describe('Base gates are setup correctly', () => {
  test.each(['not', 'and'] as BaseGateType[])('Base gate %s is defined', (type) => {
    const gate = baseGates.get(type);
    expect(gate).toBeDefined();
  });
});

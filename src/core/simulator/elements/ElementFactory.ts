import { BaseGate, BaseGateOptions } from './BaseGate';
import { Port } from './Port';
import { Gate } from './Gate';
import { CustomGate, SerializedCustomGate } from './CustomGate';
import { Circuit } from '../Circuit';

export type InputType = 'input' | 'input-group';
export type OutputType = 'output' | 'output-group';
export type PortType = InputType | OutputType;

export const baseGates = new Map<string, BaseGateOptions>([
  ['not', { type: 'not', name: 'not', color: '#f7e813', inputsCount: 1, handler: ([a]: boolean[]) => !a }],
  ['and', { type: 'and', name: 'and', color: '#1398f7', inputsCount: 2, handler: ([a, b]: boolean[]) => a && b }],
  ['or', { type: 'or', name: 'or', color: '#1398f7', inputsCount: 2, handler: ([a, b]: boolean[]) => a || b }]
]);

export class ElementFactory {
  static createBaseGate(id: string, type: string): Gate {
    const options = baseGates.get(type);
    if (!options) throw new Error(`Failed to get options for gate of type: ${type}`);
    return new BaseGate(id, options);
  }

  static createPort(id: string, type: string, connectors: number, name = '') {
    return new Port(id, type, name, connectors);
  }

  static createCustomGate(id: string, type: string, createdGates: Map<string, SerializedCustomGate>): CustomGate {
    const serializedGate = createdGates.get(type);
    if (!serializedGate) throw new Error(`Failed to get serialized custom gate of type: ${type}`);

    const circuit = Circuit.deserialize(serializedGate.circuit, createdGates);

    return new CustomGate(id, circuit, {
      type: serializedGate.type,
      name: serializedGate.name,
      color: serializedGate.color
    });
  }
}

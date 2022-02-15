import { BaseGate, BaseGateOptions } from './BaseGate';
import { Element } from './Element';
import { Gate } from './Gate';
import { CustomGate, SerializedCustomGate } from './CustomGate';
import { Circuit } from '../Circuit';

export type InputType = 'input' | 'input-group';

export const baseGates = new Map<string, BaseGateOptions>([
  ['not', { type: 'not', color: '#f7e813', inputsCount: 1, handler: ([a]: boolean[]) => !a }],
  ['and', { type: 'and', color: '#1398f7', inputsCount: 2, handler: ([a, b]: boolean[]) => a && b }],
  ['or', { type: 'or', color: '#1398f7', inputsCount: 2, handler: ([a, b]: boolean[]) => a || b }]
]);

export class ElementFactory {
  static createOutput(id: string): Element {
    const output = new Element(id, 'output');
    output.inputs[0] = false;
    output.states[0] = false;
    return output;
  }

  static createInput(id: string, type: InputType): Element {
    const input = new Element(id, type);
    input.states[0] = false;
    return input;
  }

  static createBaseGate(id: string, type: string): Gate {
    const options = baseGates.get(type);
    if (!options) throw new Error(`Failed to get options for gate of type: ${type}`);
    return new BaseGate(id, options);
  }

  static createCustomGate(id: string, type: string, createdGates: Map<string, SerializedCustomGate>): CustomGate {
    const serializedGate = createdGates.get(type);
    if (!serializedGate) throw new Error(`Failed to get serialized custom gate of type: ${type}`);

    const circuit = new Circuit();
    circuit.deserialize(serializedGate.circuit, createdGates);

    return new CustomGate(id, circuit, {
      type: serializedGate.type,
      color: serializedGate.color
    });
  }
}

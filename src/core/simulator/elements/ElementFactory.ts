import { InputType } from '../types/inputType';
import { deserialize, loadFromLocalStorage } from '../util/serialization';
import { BaseGate, gatesOptions, isBaseGate } from './BaseGate';
import { CustomGate } from './CustomGate';
import { Element } from './Element';

export class ElementFactory {
  static createOutput(id: string): Element {
    return new Element(id, 'output');
  }

  static createInput(id: string, type: InputType): Element {
    const input = new Element(id, type);
    input.states[0] = false;
    return input;
  }

  static createGate(id: string, type: string): BaseGate | CustomGate {
    if (isBaseGate(type)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const options = gatesOptions.get(type)!;
      return new BaseGate(id, options);
    }

    const serializedGates = loadFromLocalStorage();
    const serializedGate = serializedGates[type];
    if (!serializedGate) throw new Error('gate not found');

    const deserialized = deserialize(serializedGate, serializedGates);
    return new CustomGate(id, type, deserialized);
  }
}

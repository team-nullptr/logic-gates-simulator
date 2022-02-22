import { Gate, GateOptions } from './Gate';
import { baseGates } from './ElementFactory';

export type BaseGateType = 'not' | 'and';

/* checks if gate is base gate */
export const isBaseGate = (type: string): type is BaseGateType => {
  return !![...baseGates.keys()].find((key) => key == type);
};

export interface BaseGateOptions extends GateOptions {
  inputsCount: number;
  handler: (input: boolean[]) => boolean;
}

export class BaseGate extends Gate {
  readonly handler: (inputs: boolean[]) => boolean;

  constructor(id: string, { type, name, color, inputsCount, handler }: BaseGateOptions) {
    super(id, type, name, color);
    this.inputs = new Array(inputsCount).fill(false);
    this.states = [false];
    this.handler = handler;
  }

  run() {
    const previous = this.states[0];
    this.states[0] = this.handler(this.inputs);
    return this.states[0] !== previous;
  }
}

import { Gate } from "./interfaces/Gate";
import { Connection } from "./interfaces/Connection";

export const gates = new Map<string, any>([
  [
    "not",
    {
      inputsCount: 1,
      handler: ([a]: boolean[]) => !a,
    },
  ],
  [
    "or",
    {
      inputsCount: 2,
      handler: ([a, b]: boolean[]) => a || b,
    },
  ],
]);

/**
 * Basic logic gate.
 */
export class BaseGate implements Gate {
  states: boolean[] = [];
  inputs: boolean[];
  outputs: Connection[] = [];
  handler: (inputs: boolean[]) => boolean;

  constructor(readonly id: string, readonly type: string) {
    const { inputsCount, handler } = gates.get(type);
    this.inputs = new Array(inputsCount).fill(false);
    this.handler = handler;
  }

  /**
   * Executes the gate handler.
   */
  run() {
    const prev = this.states[0];
    this.states[0] = this.handler(this.inputs);
  }
}

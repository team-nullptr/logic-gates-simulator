import { Gate } from "./interfaces/Gate";
import { Connection } from "./interfaces/Connection";

// TODO: type gate config
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
  ["and", { inputsCount: 2, handler: ([a, b]: boolean[]) => a && b }],
]);

export class BaseGate implements Gate {
  states: boolean[] = [];
  inputs: boolean[];
  connections: Connection[] = [];
  handler: (inputs: boolean[]) => boolean;

  constructor(readonly id: string, readonly type: string) {
    const { inputsCount, handler } = gates.get(type);
    this.inputs = new Array(inputsCount).fill(false);
    this.handler = handler;
  }

  run() {
    const previous = this.states[0];
    this.states[0] = this.handler(this.inputs);
    return this.states[0] !== previous;
  }
}

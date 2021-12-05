import { Gate } from "./interfaces/Gate";
import { Connection } from "./interfaces/Connection";

interface BaseGateOptions {
  inputsCount: number;
  handler: (input: boolean[]) => boolean;
}

export const gates = new Map<string, BaseGateOptions>([
  ["not", { inputsCount: 1, handler: ([a]: boolean[]) => !a }],
  ["or", { inputsCount: 2, handler: ([a, b]: boolean[]) => a || b }],
  ["and", { inputsCount: 2, handler: ([a, b]: boolean[]) => a && b }],
]);

export class BaseGate implements Gate {
  states: boolean[] = [];
  inputs: boolean[];
  connections: Connection[] = [];
  handler: (inputs: boolean[]) => boolean;

  constructor(readonly id: string, readonly type: string) {
    const gate = gates.get(type);
    if (!gate) throw new Error("unknown gate");

    this.inputs = new Array(gate.inputsCount).fill(false);
    this.handler = gate.handler;
  }

  run() {
    const previous = this.states[0];
    this.states[0] = this.handler(this.inputs);
    return this.states[0] !== previous;
  }
}

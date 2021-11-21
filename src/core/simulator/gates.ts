import { GateOutput } from "./intarfaces/GateOutput";

export class Gate {
  state = false;
  inputs: boolean[] = [];
  outputs: GateOutput[] = [];

  constructor(
    readonly type: string,
    private inputsNumber: number,
    readonly handler: (inputs: boolean[]) => boolean
  ) {
    this.inputs.fill(false, 0, inputsNumber);
  }

  /**
   * Run executes gate's handler.
   * @return true if value has changed or false if not.
   */
  run(): boolean {
    const state = this.handler(this.inputs);

    if (this.state == state) return false;

    this.state = state;
    return true;
  }
}

export const gates = new Map<string, Gate>([
  ["not", new Gate("not", 1, ([a]) => !a)],
  ["or", new Gate("or", 2, ([a, b]) => a || b)],
  ["xor", new Gate("xor", 2, ([a, b]) => a !== b)],
  ["and", new Gate("and", 2, ([a, b]) => a && b)],
]);

import { v4 as uuid } from "uuid";
import { GateOutput } from "./intarfaces/GateOutput";
import { Gate, gates } from "./gates";
import { Input } from "./input";
import { Output } from "./output";

export interface ConnectRequest {
  fromId: string;
  toId: string;
  inputIndex: number;
}

export class Circuit {
  private inputs = new Map<string, Input>();
  private outputs = new Map<string, Output>();
  private gates = new Map<string, Gate>();

  /**
   * Whole circuit with inputs, gates and outputs.
   */
  get circuit() {
    return new Map<string, Gate | Input | Output>([
      ...this.inputs,
      ...this.gates,
      ...this.outputs,
    ]);
  }

  /**
   * Adds new gate, input or output to the circuit.
   */
  add(type: string): string {
    const id = uuid();

    switch (type) {
      case "input":
        const input = new Input();
        this.inputs.set(id, input);
        break;
      case "output":
        const output = new Output();
        this.outputs.set(id, output);
        break;
      default:
        const gate = gates.get(type);
        if (!gate) throw new Error(`unknown gate type: ${type}`);
        this.gates.set(id, gate);
    }

    return id;
  }

  /**
   * Connects two gates from the circuit.
   */
  connect({ fromId, toId, inputIndex }: ConnectRequest) {
    const from = this.gates.get(fromId) ?? this.inputs.get(fromId);
    const to = this.gates.get(toId);

    if (!from || !to)
      throw new Error(`gate not found: ${from ? toId : fromId}`);

    from.outputs.push({ toId, inputIndex });
    this.simulate();
  }

  /**
   * Simulates behaviour of a circuit with given inputs.
   */
  private simulate() {
    this.inputs.forEach(({ outputs, state }) => this.update(outputs, state));
  }

  /**
   * Updates all gates connected with gate output.
   */
  private update(outputs: GateOutput[], state: boolean) {
    outputs.forEach(({ toId, inputIndex }) => {
      const receiver = this.gates.get(toId) ?? this.outputs.get(toId);

      if (!receiver) throw new Error(`gate not found: ${toId}`);

      if (receiver instanceof Gate) {
        receiver.inputs[inputIndex] = state;

        const changed = receiver.run();
        if (changed) this.update(receiver.outputs, receiver.state);
      } else {
        receiver.state = state;
      }
    });
  }
}

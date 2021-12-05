import { Input } from "./Input";
import { Gate } from "./interfaces/Gate";
import { Output } from "./Output";
import { BaseGate } from "./BaseGate";
import { CustomGate } from "./CustomGate";

/** Update represents data required for gate update. */
interface Update {
  to: number;
  receiverId: string;
  state: boolean;
}

export class Circuit {
  inputs: Map<string, Input> = new Map<string, Input>();
  gates: Map<string, Gate> = new Map<string, Gate>();
  outputs: Map<string, Output> = new Map<string, Output>();

  private callStack = new Set<string>();

  /** Simulates execution of a circuit. */
  simulate() {
    this.inputs.forEach(({ connections, states }) => {
      this.callStack.clear();
      connections.forEach(({ from, to, receiverId }) => {
        this.update({ to, receiverId, state: states[from] });
      });
    });
  }

  /** Simulates execution of a single step in simulation. */
  private update({ to, receiverId, state }: Update) {
    const receiver = this.gates.get(receiverId) ?? this.outputs.get(receiverId);
    if (!receiver) throw new Error(`element not found: ${receiverId}`);

    if (receiver instanceof BaseGate || receiver instanceof CustomGate) {
      receiver.inputs[to] = state;
      const changed = receiver.run();
      if (!changed) return;

      if (this.callStack.has(receiverId))
        throw new Error("detected infinite loop");
      this.callStack.add(receiverId);

      receiver.connections.forEach(({ from, to, receiverId }) =>
        this.update({ to, receiverId, state: receiver.states[from] })
      );
    } else {
      receiver.states[0] = state;
    }
  }
}

import { Circuit } from "./circuit";
import { v4 as uuid } from "uuid";
import { getElementType } from "./utils/type";
import { Input } from "./input";
import { Output } from "./output";
import { BaseGate } from "./base-gate";
import { CutomGate } from "./cutom-gate";

/** Represents a connection request. */
interface ConnectRequest {
  emitterId: string;
  receiverId: string;
  from: number;
  to: number;
}

export class Simulator {
  circuit = new Circuit();

  /** Adds a new gate to the simulator's circuit. */
  add(element: string) {
    const id = uuid();
    const type = getElementType(element);

    switch (type) {
      case "input":
        this.circuit.inputs.set(id, new Input(id));
        break;
      case "output":
        this.circuit.outputs.set(id, new Output(id));
        break;
      case "base":
        this.circuit.gates.set(id, new BaseGate(id, element));
        break;
      case "custom":
        this.circuit.gates.set(id, new CutomGate(id, element));
        break;
    }

    return id;
  }

  toggle(id: string) {
    const input = this.circuit.inputs.get(id);
    if (!input) throw new Error("input not found");
    input.states[0] = true;
  }

  /** Connects two gates together. */
  connect({ emitterId, receiverId, from, to }: ConnectRequest) {
    const emitter =
      this.circuit.gates.get(emitterId) ?? this.circuit.inputs.get(emitterId);
    const receiver =
      this.circuit.gates.get(receiverId) ??
      this.circuit.outputs.get(receiverId);

    if (!emitter || !receiver) {
      throw new Error("unable to get gates");
    }

    emitter.connections.push({ from, to, receiverId });
    this.circuit.simulate();
  }
}

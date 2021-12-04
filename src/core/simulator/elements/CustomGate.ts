import { Input } from "./Input";
import { Output } from "./Output";
import { BaseGate } from "./BaseGate";
import { Gate } from "./interfaces/Gate";
import { Connection } from "./interfaces/Connection";
import { Circuit } from "../Circuit";
import { getElementType } from "./utils/type";

/** Represents a serialized custom gate. */
interface SerializedCustomGate {
  inputs: {
    id: string;
    connections: Connection[];
  }[];
  gates: {
    id: string;
    element: string;
    connections: Connection[];
  }[];
  outputs: {
    id: string;
  }[];
}

/** loadFromStorage loads serialized custom gate from local storage. */
const loadFromLocalStorage = (element: string): SerializedCustomGate => {
  const raw = localStorage.getItem(element);
  if (!raw) throw new Error("failed to load custom gate");
  return JSON.parse(raw);
};

export class CustomGate implements Gate {
  states: boolean[] = [];
  inputs: boolean[] = [];
  connections: Connection[] = [];

  private circuit = new Circuit();

  constructor(readonly id: string, readonly type: string) {
    this.load();
  }

  run() {
    [...this.circuit.inputs.values()].forEach((input, index) => {
      input.states[0] = this.inputs[index];
    });

    this.circuit.simulate();

    let changed = false;
    [...this.circuit.outputs.values()].forEach(({ states }, index) => {
      const previous = this.states[index];
      this.states[index] = states[0];
      changed = previous !== this.states[index];
    });

    return changed;
  }

  /** Load serialized gate. */
  private load() {
    const serialized = loadFromLocalStorage(this.type);

    this.inputs = new Array(serialized.inputs.length).fill(false);
    this.states = new Array(serialized.outputs.length).fill(undefined);

    serialized.gates.forEach(({ id, element, connections }) => {
      let gate: Gate;
      const type = getElementType(element);

      if (type == "base") gate = new BaseGate(id, element);
      else gate = new CustomGate(id, element);

      gate.connections.push(...connections);
      this.circuit.gates.set(id, gate);
    });

    serialized.inputs.forEach(({ id, connections }) => {
      const input = new Input(id);
      input.connections.push(...connections);
      this.circuit.inputs.set(id, input);
    });

    serialized.outputs.forEach(({ id }) => {
      const output = new Output(id);
      this.circuit.outputs.set(id, output);
    });
  }
}

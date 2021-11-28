import { Input } from "./Input";
import { Output } from "./Output";
import { BaseGate } from "./BaseGate";
import { Gate } from "./interfaces/Gate";
import { Connection } from "./interfaces/Connection";
import { Circuit } from "../Circuit";
import { getElementType } from "./utils/type";

/**
 * Represents a serialized custom gate.
 */
interface SerializedCustomGate {
  inputs: {
    id: string;
    outputs: Connection[];
  }[];
  gates: {
    id: string;
    element: string;
    outputs: Connection[];
  }[];
  outputs: {
    id: string;
  }[];
}

/**
 * loadFromStorage loads serialized custom gate from local storage.
 */
const loadFromLocalStorage = (element: string): SerializedCustomGate => {
  const raw = localStorage.getItem(element);
  if (!raw) throw new Error("failed to load custom gate");
  return JSON.parse(raw);
};

/**
 * Gate created by a user.
 */
export class CustomGate implements Gate {
  states: boolean[] = [];
  inputs: boolean[] = [];
  outputs: Connection[] = [];

  private serialized: SerializedCustomGate;
  private circuit = new Circuit();

  constructor(readonly id: string, readonly type: string) {
    this.serialized = loadFromLocalStorage(type);

    this.inputs = new Array(this.serialized.inputs.length).fill(false);
    this.states = new Array(this.serialized.outputs.length).fill(undefined);

    this.serialized.gates.forEach(({ id, element, outputs }) => {
      let gate: Gate;
      const type = getElementType(element);

      if (type == "base") gate = new BaseGate(id, element);
      else gate = new CustomGate(id, element);

      gate.outputs.push(...outputs);
      this.circuit.gates.set(id, gate);
    });

    this.serialized.inputs.forEach(({ id, outputs }) => {
      const input = new Input(id);
      input.outputs.push(...outputs);
      this.circuit.inputs.set(id, input);
    });

    this.serialized.outputs.forEach(({ id }) => {
      const output = new Output(id);
      this.circuit.outputs.set(id, output);
    });
  }

  /**
   * Executes the custom gate's circuit.
   */
  run() {
    [...this.circuit.inputs.values()].forEach((input, index) => {
      input.state[0] = this.inputs[index];
    });

    this.circuit.simulate();

    [...this.circuit.outputs.values()].forEach(({ state }, index) => {
      const prev = this.states[index];
      this.states[index] = state[0];
    });
  }
}

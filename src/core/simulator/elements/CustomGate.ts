import { Gate, GateOptions } from './Gate';
import { Circuit } from '../Circuit';

import { SerializedCircuit } from '../Circuit';

export interface SerializedCustomGate {
  type: string;
  name: string;
  color: string;
  circuit: SerializedCircuit;
  dependencies: string[];
}

export class CustomGate extends Gate {
  readonly inputsNames: string[] = [];
  readonly outputsNames: string[] = [];

  constructor(
    id: string,
    readonly circuit: Circuit,
    readonly dependencies = new Set<string>(),
    { type, name, color }: GateOptions
  ) {
    super(id, type, name, color);

    circuit.inputs.forEach((it) => this.inputs.push(...new Array(it.connectors).fill(false)));
    circuit.outputs.forEach((it) => this.states.push(...new Array(it.connectors).fill(false)));

    for (const input of circuit.inputs.values()) {
      if (input.connectors > 1) this.inputsNames.push(...new Array(input.connectors).fill(''));
      else this.inputsNames.push(input.name);
    }

    for (const output of circuit.outputs.values()) {
      if (output.connectors > 1) this.inputsNames.push(...new Array(output.connectors).fill(''));
      else this.outputsNames.push(output.name);
    }
  }

  run() {
    let currentIndex = 0;

    [...this.circuit.inputs.values()].forEach((input) => {
      input.states = this.inputs.slice(currentIndex, currentIndex + input.states.length);
      currentIndex += input.states.length;
    });

    this.circuit.simulate();

    currentIndex = 0;
    let changed = false;

    [...this.circuit.outputs.values()].forEach(({ states }) => {
      for (let i = currentIndex; i < currentIndex + states.length; i++) {
        const previous = this.states[i];
        this.states[i] = states[i - currentIndex];
        changed = changed || previous !== this.states[i];
      }
      currentIndex += states.length;
    });

    return changed;
  }
}

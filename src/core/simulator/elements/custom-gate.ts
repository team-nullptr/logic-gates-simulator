import { Gate } from '../types/gate';
import { Circuit } from '../circuit';
import { DeserializedCustomGate } from '../util/serialization';

export class CustomGate extends Gate {
  private circuit = new Circuit();

  constructor(
    id: string,
    type: string,
    { color, inputs, gates, outputs }: DeserializedCustomGate
  ) {
    super(id, type, color);

    inputs.forEach((input) => {
      this.inputs.push(false);
      this.circuit.inputs.set(input.id, input);
    });

    gates.forEach((gate) => this.circuit.gates.set(gate.id, gate));

    outputs.forEach((output) => {
      this.states.push(false);
      this.circuit.outputs.set(output.id, output);
    });
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
}

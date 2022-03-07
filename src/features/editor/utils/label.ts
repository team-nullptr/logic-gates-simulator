import { Gate } from '../../../core/simulator/elements/Gate';
import { CustomGate } from '../../../core/simulator/elements/CustomGate';

export const label = (gate: Gate): [inputs: string[], outputs: string[]] => {
  const custom = gate instanceof CustomGate;
  if (!custom) return [['A', 'B'], ['P']];
  return [gate.inputsNames, gate.outputsNames];
};

import { gatesOptions } from '../elements/BaseGate';
import { fetchSavedGates } from './serialization';

/**
 * Returns all available gates.
 */
export const getAllGates = () => {
  const serializedGates = fetchSavedGates();

  const base = [...gatesOptions.values()].map(
    ({ type, color, inputsCount }) => ({
      type,
      color,
      inputsCount,
      outputsCount: 1
    })
  );

  const custom = Object.entries(serializedGates).map(
    ([type, { color, inputs, outputs }]) => ({
      type,
      color,
      inputsCount: inputs.length,
      outputsCount: outputs.length
    })
  );

  return [...base, ...custom];
};

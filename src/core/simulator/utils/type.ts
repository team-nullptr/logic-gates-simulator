import { gates } from "../base-gate";

/** Finds out the type of an element by it's name. */
export const getElementType = (element: string) => {
  if (gates.has(element)) return "base";
  else if (element == "input") return "input";
  else if (element == "output") return "output";
  return "custom";
};

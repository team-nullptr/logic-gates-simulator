import { Vector } from "../../../common/Vector";
import { Block } from "../../../common/Block";

export interface Connector {
  block: Block;
  position?: Vector;
  type: "input" | "output";
  index: number;
}

export const isConnector = (object: any): object is Connector => {
  if (!object) return false;
  const { block, type, index } = object;

  return (
    block instanceof Block &&
    ["input", "output"].includes(type) &&
    typeof index === "number"
  );
};

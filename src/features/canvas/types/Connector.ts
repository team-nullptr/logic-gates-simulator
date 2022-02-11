import { Vector } from "../../../common/Vector";
import { Block } from "../../../common/Block";
import { Button } from "./Button";

export interface Connector {
  block: Block | Button;
  position?: Vector;
  type: "input" | "output";
  index: number;
}

export const isConnector = (object: any): object is Connector => {
  if (!object) return false;
  const { block, type, index } = object;

  return (
    (block instanceof Block || block instanceof Button) &&
    ["input", "output"].includes(type) &&
    typeof index === "number"
  );
};

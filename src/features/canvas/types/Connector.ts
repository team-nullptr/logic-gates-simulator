import { Vector } from "../../../common/Vector";
import { Block } from "../../../common/Block";

export interface Connector {
  block: Block;
  position?: Vector;
  type: "input" | "output";
  index: number;
}

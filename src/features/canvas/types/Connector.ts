import { Vector } from "../../../common/Vector";

export interface Connector {
  position: Vector;
  index: number;
  type: "input" | "output";
}

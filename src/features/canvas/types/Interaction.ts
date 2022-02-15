import { Vector } from "../../../common/Vector";
import { Target } from "./Target";

export interface Interaction {
  mouse: Vector;
  position: Vector;
  target: Target;
}

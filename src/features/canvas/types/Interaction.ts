import { Vector } from "../../../common/Vector";
import { InteractionManager } from "../InteractionManager";
import { Target } from "./Target";

export interface Interaction {
  mouse: Vector;
  position: Vector;
  target: Target;
  manager: InteractionManager;
}

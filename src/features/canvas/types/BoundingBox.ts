import { Vector } from "../../../common/Vector";
import { Area } from "./Area";

export interface BoundingBox {
  readonly area: Area;
  readonly size: Vector;
}

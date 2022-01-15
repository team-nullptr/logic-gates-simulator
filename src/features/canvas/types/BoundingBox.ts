import { Vector } from "./Vector";
import { Area } from "./Area";

export interface BoundingBox {
  readonly area: Area;
  readonly size: Vector;
}

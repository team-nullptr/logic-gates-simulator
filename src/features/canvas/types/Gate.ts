import { Vector } from "./Vector";

export interface Gate {
  readonly id: string;
  text: string;
  color: string;
  position: Vector;
  readonly inputs: boolean[];
  readonly outputs: boolean[];

  /** Special gates are narrow and stay visible all the time. */
  readonly special: boolean;
}

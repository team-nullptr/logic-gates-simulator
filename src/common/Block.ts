import { Vector } from "./Vector";

export interface Block {
  readonly id: string;
  text: string;
  color: string;
  position: Vector;
  readonly inputs: boolean[];
  readonly outputs: boolean[];
  readonly control: boolean;
}

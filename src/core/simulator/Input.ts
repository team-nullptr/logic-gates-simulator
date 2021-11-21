import { GateOutput } from "./intarfaces/GateOutput";

export class Input {
  type = "input";
  state = false;
  outputs: GateOutput[] = [];
}

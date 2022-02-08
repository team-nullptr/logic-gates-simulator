import { Tool } from "./Tool";
import { Interaction } from "../types/Interaction";
import { Vector } from "../../../common/Vector";
import { add, subtract } from "../../../common/utils";

export class PanTool extends Tool {
  private previous!: Vector;

  handleMouseDown({ mouse }: Interaction) {
    this.previous = mouse;
  }

  handleMouseMove({ mouse }: Interaction) {
    const difference = subtract(mouse, this.previous);

    if (!this.source) return;
    this.source.offset = add(this.source.offset, difference);

    this.previous = mouse;
  }
}

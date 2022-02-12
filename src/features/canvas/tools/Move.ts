import { Tool } from "./Tool";
import { Interaction } from "../types/Interaction";
import { Vector } from "../../../common/Vector";
import { Block } from "../types/Block";
import { subtract } from "../../../common/utils";

const snapToGrid = (position: Vector): Vector => {
  return position.map((it) => Math.round(it / 48)) as Vector;
};

export class MoveTool extends Tool {
  private offset!: Vector;
  private target!: Block;

  handleMouseDown({ position, target }: Interaction) {
    const block = target as Block;
    const corner = block.area.slice(0, 2) as Vector;
    this.offset = subtract(position, corner);
    this.target = block;
  }

  handleMouseMove({ position }: Interaction) {
    const corner = subtract(position, this.offset);
    this.target.move(snapToGrid(corner));
  }
}

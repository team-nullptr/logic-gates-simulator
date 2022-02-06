import { Vector } from "../../common/Vector";
import { Adapter } from "../editor/Adapter";
import { subtract } from "../../common/utils";
import { Tool } from "./tools/Tool";
import { Interaction } from "./types/Interaction";
import { ToolFactory } from "./tools/ToolFactory";
import { findToolName } from "./utils";
import { Target } from "./types/Target";

export class InteractionManager {
  offset: Vector;

  private readonly canvas: HTMLCanvasElement;
  private pressed = false;

  private tool!: Tool;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly source: Adapter
  ) {
    this.canvas = ctx.canvas;

    const { e, f } = ctx.getTransform();
    this.offset = [e, f];

    this.init();
  }

  destroy(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    removeEventListener("mouseup", this.handleMouseUp);
  }

  private resolve(at: Vector): Target {
    const gates = this.source.gates.values();
    for (const block of gates) {
      const [collides, connector] = block.collides(at);
      if (!collides) continue;

      if (connector) {
        return connector;
      } else {
        return block;
      }
    }

    return undefined;
  }

  private init(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    addEventListener("mouseup", this.handleMouseUp);
  }

  private constructMouseEvent(mouse: Vector): Interaction {
    const position = subtract(mouse, this.offset);
    const target = this.resolve(position);
    return { mouse, position, target, manager: this };
  }

  private handleMouseDown = ({ offsetX, offsetY }: MouseEvent): void => {
    this.pressed = true;

    const event = this.constructMouseEvent([offsetX, offsetY]);
    const target = event.target;

    const toolName = findToolName(target);
    this.tool = ToolFactory.get(toolName);

    this.tool.handleMouseDown(event);
  };

  private handleMouseMove = ({ offsetX, offsetY }: MouseEvent): void => {
    if (!this.pressed) return;

    const event = this.constructMouseEvent([offsetX, offsetY]);
    this.tool.handleMouseMove(event);
  };

  private handleMouseUp = ({ offsetX, offsetY }: MouseEvent): void => {
    this.pressed = false;

    const event = this.constructMouseEvent([offsetX, offsetY]);
    this.tool.handleMouseUp(event);
  };
}

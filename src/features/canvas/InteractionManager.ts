import { Vector } from "../../common/Vector";
import { Adapter } from "../editor/Adapter";
import { subtract } from "../../common/utils";
import { Tool } from "./tools/Tool";
import { Interaction } from "./types/Interaction";
import { Target } from "./types/Target";

type InteractionListener = (interaction: Interaction) => void;

export class InteractionManager {
  tool?: Tool;
  private readonly listeners = new Set<InteractionListener>();

  private readonly canvas: HTMLCanvasElement;
  private pressed = false;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly source: Adapter
  ) {
    this.canvas = ctx.canvas;
    this.init();
  }

  destroy(): void {
    this.listeners.clear();
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    removeEventListener("mouseup", this.handleMouseUp);
  }

  addEventListener(type: "interaction", fn: InteractionListener): void {
    this.listeners.add(fn);
  }

  removeEventListener(type: "interaction", fn: InteractionListener): void {
    this.listeners.delete(fn);
  }

  private resolve(at: Vector): Target {
    const gates = this.source.gates.values();
    for (const block of gates) {
      const [collides, connector] = block.collides(at);

      if (connector) {
        return connector;
      } else if (collides) {
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
    const position = subtract(mouse, this.source.offset);
    const target = this.resolve(position);
    return { mouse, position, target };
  }

  private handleMouseDown = ({ offsetX, offsetY }: MouseEvent): void => {
    this.pressed = true;

    const interaction = this.constructMouseEvent([offsetX, offsetY]);
    this.listeners.forEach((listener) => listener(interaction));
  };

  private handleMouseMove = ({ offsetX, offsetY }: MouseEvent): void => {
    if (!this.pressed) return;
    if (!this.tool) return;

    const event = this.constructMouseEvent([offsetX, offsetY]);
    this.tool.handleMouseMove(event);
  };

  private handleMouseUp = ({ offsetX, offsetY }: MouseEvent): void => {
    this.pressed = false;

    if (!this.tool) return;
    const event = this.constructMouseEvent([offsetX, offsetY]);
    this.tool.handleMouseUp(event);
  };
}

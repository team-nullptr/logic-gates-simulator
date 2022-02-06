import { Vector } from "../../common/Vector";
import { Adapter } from "../editor/Adapter";
import { add, subtract } from "../../common/utils";

export class InteractionManager {
  offset: Vector;

  private readonly canvas: HTMLCanvasElement;
  private pressed = false;
  private mouse: Vector = [0, 0];

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

  private resolve(at: Vector): unknown {
    // TODO:
    return undefined;
  }

  private init(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    addEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseDown = ({ offsetX, offsetY }: MouseEvent): void => {
    this.pressed = true;
    this.mouse = [offsetX, offsetY];
  };

  private handleMouseMove = ({ offsetX, offsetY }: MouseEvent): void => {
    const previous = this.mouse;
    this.mouse = [offsetX, offsetY];

    if (!this.pressed) return;

    const resolved = this.resolve(this.mouse);

    if (resolved === undefined) {
      const difference = subtract(this.mouse, previous);
      this.offset = add(this.offset, difference);
    }
  };

  private handleMouseUp = (): void => {
    this.pressed = false;
  };
}

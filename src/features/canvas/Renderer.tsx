import { Vector } from "./types/Vector";

export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;

  private dragging = false;
  private previous: Vector = [0, 0];
  private offset: Vector = [0, 0];

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.initialize();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    removeEventListener("mouseup", this.handleMouseUp);
  }

  private initialize() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    addEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseDown = ({ offsetX, offsetY }: MouseEvent) => {
    this.dragging = true;
    this.previous = [offsetX, offsetY];
  };

  private handleMouseMove = ({ offsetX, offsetY }: MouseEvent) => {
    if (!this.dragging) return;
    this.updateOffset([offsetX, offsetY]);
  };

  private updateOffset([x, y]: Vector) {
    this.offset[0] += x - this.previous[0];
    this.offset[1] += y - this.previous[1];
    this.previous = [x, y];
  }

  private handleMouseUp = () => {
    this.dragging = false;
  };
}

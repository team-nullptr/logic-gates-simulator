import { Vector } from "./types/Vector";
import { Manager } from "./Manager";

export class Renderer {
  private running = true;
  private readonly ctx: CanvasRenderingContext2D;

  private dragging = false;
  private previous: Vector = [0, 0];
  private offset: Vector = [0, 0];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly manager: Manager
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.initialize();
    this.render();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    removeEventListener("mouseup", this.handleMouseUp);
    removeEventListener("resize", this.resize);
    this.running = false;
  }

  private render = () => {
    if (!this.running) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.setTransform(1, 0, 0, 1, ...this.offset);

    requestAnimationFrame(this.render);
  };

  private initialize() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    addEventListener("mouseup", this.handleMouseUp);
    addEventListener("resize", this.resize);
    this.resize();
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

  private resize = () => {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  };
}

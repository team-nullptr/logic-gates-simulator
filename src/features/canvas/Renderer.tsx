export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;

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

  private handleMouseDown = (e: MouseEvent) => {
    console.log("mousedown", e);
  };

  private handleMouseMove = (e: MouseEvent) => {
    console.log("mousemove", e);
  };

  private handleMouseUp = (e: MouseEvent) => {
    console.log("mouseup", e);
  };
}

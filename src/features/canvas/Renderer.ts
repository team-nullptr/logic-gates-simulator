import { Vector } from "../../common/Vector";
import { Adapter } from "../editor/Adapter";
import { renderGate } from "./renderers/gate";
import { Block } from "../../common/Block";
import { Connector } from "./types/Connector";

export class Renderer {
  private running = true;
  private readonly ctx: CanvasRenderingContext2D;

  private dragging = false;
  private previous: Vector = [0, 0];
  private offset: Vector = [0, 0];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly adapter: Adapter
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

    const { e, f } = this.ctx.getTransform();
    this.ctx.clearRect(-e, -f, this.canvas.width, this.canvas.height);
    this.ctx.setTransform(1, 0, 0, 1, ...this.offset);

    this.renderGates();

    requestAnimationFrame(this.render);
  };

  private renderGates() {
    const gates = this.adapter.gates;
    gates.forEach((gate) => renderGate(gate, this.ctx));
  }

  private initialize() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    addEventListener("mouseup", this.handleMouseUp);
    addEventListener("resize", this.resize);
    this.resize();
  }

  private handleMouseDown = ({ offsetX, offsetY }: MouseEvent) => {
    const { e, f } = this.ctx.getTransform();
    const [block, port] = this.checkTarget([offsetX - e, offsetY - f]);

    console.warn(block, port);

    this.dragging = true;
    this.previous = [offsetX, offsetY];
  };

  private checkTarget(other: Vector): [block?: Block, connector?: Connector] {
    for (const block of this.adapter.gates) {
      const [rectangle, connectors] = block.collides(other);

      if (!rectangle && !connectors) continue;
      return [block, connectors];
    }

    return [];
  }

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

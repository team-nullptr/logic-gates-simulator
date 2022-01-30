import { Vector } from "../../common/Vector";
import { Adapter } from "../editor/Adapter";
import { renderGate } from "./renderers/gate";
import { Block } from "../../common/Block";
import { Connector } from "./types/Connector";
import { renderConnection } from "./renderers/connection";

export class Renderer {
  private running = true;
  private readonly ctx: CanvasRenderingContext2D;

  private grabbed: Block | undefined = undefined;
  private shift: Vector = [0, 0];

  private dragging = false;
  private offset: Vector = [0, 0];
  private previous: Vector = [0, 0];

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

    this.renderConnections();
    this.renderGates();

    requestAnimationFrame(this.render);
  };

  private renderConnections() {
    const connections = this.adapter.connections;

    // TODO: Replace array with a map in Adapter.ts
    const gates = new Map(this.adapter.gates.map((it) => [it.id, it]));

    connections.forEach((connection) =>
      renderConnection(connection, gates, this.ctx)
    );
  }

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
    const [block] = this.checkTarget([offsetX - e, offsetY - f]);

    if (block) {
      const [x, y] = block.area;
      this.grabbed = block;
      this.shift = [offsetX - x, offsetY - y];
    }

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

    if (this.grabbed) {
      this.updatePosition([offsetX, offsetY]);
    } else {
      this.updateOffset([offsetX, offsetY]);
    }
  };

  private updatePosition([x, y]: Vector) {
    if (!this.grabbed) return;

    const [sx, sy] = this.shift;
    const position = [x - sx, y - sy].map((v) => Math.round(v / 48));
    this.grabbed.position = position as Vector;
  }

  private updateOffset([x, y]: Vector) {
    this.offset[0] += x - this.previous[0];
    this.offset[1] += y - this.previous[1];
    this.previous = [x, y];
  }

  private handleMouseUp = () => {
    this.dragging = false;
    this.grabbed = undefined;
  };

  private resize = () => {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  };
}

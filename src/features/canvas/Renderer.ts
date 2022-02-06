import { Adapter } from "../editor/Adapter";
import { renderGate } from "./renderers/gate";
import { renderConnection } from "./renderers/connection";

export class Renderer {
  constructor(private readonly source: Adapter) {}

  render(ctx: CanvasRenderingContext2D) {
    this.renderConnections(ctx);
    this.renderGates(ctx);
  }

  private renderGates(ctx: CanvasRenderingContext2D) {
    const gates = this.source.gates;
    gates.forEach((gate) => renderGate(gate, ctx));
  }

  private renderConnections(ctx: CanvasRenderingContext2D) {
    const connections = this.source.connections;
    connections.forEach((connection) =>
      renderConnection(connection, this.source.gates, ctx)
    );
  }
}

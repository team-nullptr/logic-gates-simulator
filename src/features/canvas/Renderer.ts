import { Adapter } from "../editor/Adapter";
import { renderGate } from "./renderers/gate";
import { renderConnection } from "./renderers/connection";
import { drawConnectors } from "./renderers/connector";

export class Renderer {
  constructor(private readonly source: Adapter) {}

  render(ctx: CanvasRenderingContext2D) {
    this.renderConnections(ctx);
    this.renderButtons(ctx);
    this.renderGates(ctx);
  }

  private renderGates(ctx: CanvasRenderingContext2D) {
    const gates = this.source.gates;
    gates.forEach((gate) => renderGate(gate, ctx));
  }

  private renderButtons(ctx: CanvasRenderingContext2D) {
    const buttons = this.source.buttons;
    buttons.forEach((button) => {
      const connectors = button.connectors.map((it) => it.position);
      drawConnectors(ctx, connectors, "hsl(266,99%,64%)");
    });
  }

  private renderConnections(ctx: CanvasRenderingContext2D) {
    const { connections, connecting } = this.source;

    if (connecting) {
      const { block, type, index } = connecting[0];
      const start = block.findConnector(type, index)!;
      renderConnection([start, connecting[1]], ctx);
    }

    connections.forEach((it) => {
      const [source, receiver] = it;

      const start = source.block.findConnector(source.type, source.index);
      const end = receiver.block.findConnector(receiver.type, receiver.index);

      if (!start || !end) return;

      renderConnection([start, end], ctx);
    });
  }
}

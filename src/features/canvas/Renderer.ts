import { Adapter } from '../editor/Adapter';
import { renderConnection } from './renderers/connection';

export class Renderer {
  constructor(private readonly source: Adapter) {}

  render(ctx: CanvasRenderingContext2D) {
    this.source.updateButtons();
    this.renderConnections(ctx);
    this.renderGates(ctx);
  }

  private renderGates(ctx: CanvasRenderingContext2D) {
    this.source.gates.forEach((it) => it.render(ctx));
  }

  private renderConnections(ctx: CanvasRenderingContext2D) {
    const { connecting, connections } = this.source;

    if (connecting) {
      const [{ group, at }, end] = connecting;
      const start = group.items[at];

      if (group.side === 'output') {
        renderConnection([start, end], ctx);
      } else {
        renderConnection([end, start], ctx);
      }
    }

    connections.forEach((it) => {
      const { from, to } = it;

      const start = from.group.items[from.at];
      const end = to.group.items[to.at];

      renderConnection([start, end], ctx);
    });
  }
}

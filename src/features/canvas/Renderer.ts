import { Adapter } from '../editor/Adapter';
import { renderConnection } from './renderers/connection';
import { Connection } from './types/Connection';

export class Renderer {
  constructor(private readonly source: Adapter) {}

  render(ctx: CanvasRenderingContext2D) {
    this.source.updateButtons();
    this.renderConnections(ctx);
    this.renderGates(ctx);
  }

  private renderGates(ctx: CanvasRenderingContext2D) {
    this.source.gates.forEach((it) => it.render(ctx, this.source.labels));
  }

  private renderConnections(ctx: CanvasRenderingContext2D) {
    const { connecting, connections, hoveredConnection } = this.source;

    if (connecting) {
      const [{ group, at }, end] = connecting;
      const start = group.items[at];

      if (group.side === 'output') {
        renderConnection([start, end], group.states[at], ctx);
      } else {
        renderConnection([end, start], false, ctx);
      }
    }

    const grayed = !!hoveredConnection;
    let over: Connection | undefined;

    connections.forEach((it) => {
      if (it === hoveredConnection) {
        over = it;
      } else {
        this.renderConnection(ctx, it, grayed);
      }
    });

    if (over) {
      this.renderConnection(ctx, over, false);
    }
  }

  private renderConnection = (ctx: CanvasRenderingContext2D, connection: Connection, grayed: boolean) => {
    const { from, to } = connection;
    const state = from.group.states[from.at];

    const start = from.group.items[from.at];
    const end = to.group.items[to.at];

    renderConnection([start, end], state, ctx, grayed);
  };
}

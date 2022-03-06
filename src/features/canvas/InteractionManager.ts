import { Vector } from '../../common/Vector';
import { Adapter } from '../editor/Adapter';
import { isDeleteChord, subtract } from '../../common/utils';
import { Tool } from './tools/Tool';
import { Interaction } from './types/Interaction';
import { Target } from './types/Target';
import { isGateDataTransfer } from '../../common/GateDataTransfer';
import { Block } from './types/Block';
import { collides } from './renderers/connection';
import { isConnector } from './types/Connector';

type InteractionListener = (interaction: Interaction) => void;

export class InteractionManager {
  tool?: Tool;

  private readonly listeners = {
    interaction: new Set<InteractionListener>(),
    hover: new Set<InteractionListener>()
  };

  private readonly canvas: HTMLCanvasElement;
  private pressed = false;

  constructor(private readonly ctx: CanvasRenderingContext2D, private readonly source: Adapter) {
    this.canvas = ctx.canvas;
    this.init();
  }

  destroy(): void {
    this.listeners.interaction.clear();
    this.listeners.hover.clear();
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('dragover', this.handleDragOver);
    this.canvas.removeEventListener('drop', this.handleDrop);
  }

  addEventListener(type: 'interaction' | 'hover', fn: InteractionListener): void {
    this.listeners[type].add(fn);
  }

  removeEventListener(type: 'interaction' | 'hover', fn: InteractionListener): void {
    this.listeners[type].delete(fn);
  }

  private resolve(at: Vector): Target {
    const gates = this.source.gates.values();
    const buttons = this.source.ports.values();
    const connections = this.source.connections;

    for (const button of buttons) {
      const connector = button.collides(at);
      if (button.collides(at)) return connector;
    }

    for (const block of gates) {
      const result = block.collides(at);
      if (result) return result;
    }

    for (const connection of connections) {
      const { from, to } = connection;
      const start = from.group.items[from.at];
      const end = to.group.items[to.at];
      if (collides(start, end, at)) return connection;
    }
  }

  private init(): void {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('dragover', this.handleDragOver);
    this.canvas.addEventListener('drop', this.handleDrop);
  }

  private constructMouseEvent(mouse: Vector): Interaction {
    const position = subtract(mouse, this.source.offset);
    const target = this.resolve(position);
    return { mouse, position, target };
  }

  private handleMouseDown = (event: MouseEvent): void => {
    const { offsetX, offsetY } = event;

    const interaction = this.constructMouseEvent([offsetX, offsetY]);
    const { target } = interaction;

    if (target && isDeleteChord(event)) {
      if (target instanceof Block) {
        this.source.removeGate(target.id);
      } else if (isConnector(target)) {
        this.source.disconnectConnector(target);
      } else {
        this.source.disconnect(target);
      }

      return;
    }

    this.pressed = true;
    this.listeners.interaction.forEach((listener) => listener(interaction));
  };

  private handleMouseMove = ({ offsetX, offsetY }: MouseEvent): void => {
    const event = this.constructMouseEvent([offsetX, offsetY]);

    if (this.pressed && this.tool) return this.tool.handleMouseMove(event);
    return this.listeners.hover.forEach((listener) => listener(event));
  };

  private handleMouseUp = ({ offsetX, offsetY }: MouseEvent): void => {
    this.pressed = false;

    if (!this.tool) return;
    const event = this.constructMouseEvent([offsetX, offsetY]);
    this.tool.handleMouseUp(event);
  };

  private handleDragOver = (event: DragEvent): void => {
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  };

  private handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    if (!event.dataTransfer) return;

    const data = event.dataTransfer.getData('gate/json');
    if (!data) return;

    const payload = JSON.parse(data);
    if (!payload || !isGateDataTransfer(payload)) return;

    const { type, offset } = payload;

    const mouse: Vector = [event.offsetX, event.offsetY];
    const corner = subtract(mouse, offset);

    this.source.addGate(type, corner);
  };
}

import { Vector } from '../../common/Vector';
import { Adapter } from '../editor/Adapter';
import { subtract } from '../../common/utils';
import { Tool } from './tools/Tool';
import { Interaction } from './types/Interaction';
import { Target } from './types/Target';
import { isGateDataTransfer } from '../../common/GateDataTransfer';
import { Block } from './types/Block';

type InteractionListener = (interaction: Interaction) => void;

export class InteractionManager {
  tool?: Tool;
  private readonly listeners = new Set<InteractionListener>();

  private readonly canvas: HTMLCanvasElement;
  private pressed = false;

  constructor(private readonly ctx: CanvasRenderingContext2D, private readonly source: Adapter) {
    this.canvas = ctx.canvas;
    this.init();
  }

  destroy(): void {
    this.listeners.clear();
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('dragover', this.handleDragOver);
    this.canvas.removeEventListener('drop', this.handleDrop);
  }

  addEventListener(type: 'interaction', fn: InteractionListener): void {
    this.listeners.add(fn);
  }

  removeEventListener(type: 'interaction', fn: InteractionListener): void {
    this.listeners.delete(fn);
  }

  private resolve(at: Vector): Target {
    const gates = this.source.gates.values();
    const buttons = this.source.buttons.values();

    for (const button of buttons) {
      const connector = button.collides(at);
      if (button.collides(at)) {
        return connector;
      }
    }

    for (const block of gates) {
      const result = block.collides(at);
      if (result) return result;
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

  private handleMouseDown = ({ offsetX, offsetY, button, altKey }: MouseEvent): void => {
    const interaction = this.constructMouseEvent([offsetX, offsetY]);

    const deleteKey = button === 1 || (button === 0 && altKey);
    const { target } = interaction;

    if (target && deleteKey) {
      if (target instanceof Block) {
        this.source.removeGate(target.id);
      } else {
        this.source.disconnectFrom(target);
      }

      return;
    }

    this.pressed = true;
    this.listeners.forEach((listener) => listener(interaction));
  };

  private handleMouseMove = ({ offsetX, offsetY }: MouseEvent): void => {
    if (!this.pressed) return;
    if (!this.tool) return;

    const event = this.constructMouseEvent([offsetX, offsetY]);
    this.tool.handleMouseMove(event);
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
    if (!event.dataTransfer) return;

    const data = event.dataTransfer.getData('gate/json');
    if (!data) return;

    const payload = JSON.parse(data);

    if (!payload || !isGateDataTransfer(payload)) return;

    const { id, offset } = payload;

    const mouse: Vector = [event.offsetX, event.offsetY];
    const corner = subtract(mouse, offset);

    this.source.addGate(id, corner);
  };
}

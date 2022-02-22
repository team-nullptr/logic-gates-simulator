import { Vector } from '../../common/Vector';

type RenderListener = (ctx: CanvasRenderingContext2D) => void;

export class CanvasHelper {
  offset: Vector = [0, 0];

  private readonly ctx: CanvasRenderingContext2D;
  private readonly listeners = new Set<RenderListener>();
  private running = true;

  constructor(private readonly canvas: HTMLCanvasElement) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.ctx = canvas.getContext('2d')!;
    this.initialize();
    this.render();
  }

  destroy(): void {
    this.running = false;
    this.listeners.clear();
    removeEventListener('resize', this.resize);
  }

  addEventListener(type: 'render', fn: RenderListener): void {
    this.listeners.add(fn);
  }

  removeEventListener(type: 'render', fn: RenderListener): void {
    this.listeners.delete(fn);
  }

  private render = (): void => {
    if (!this.running) return;

    const [e, f] = this.offset;
    this.ctx.setTransform(1, 0, 0, 1, e, f);
    this.ctx.clearRect(-e, -f, this.canvas.width, this.canvas.height);

    this.listeners.forEach((l) => l(this.ctx));

    requestAnimationFrame(this.render);
  };

  private initialize(): void {
    addEventListener('resize', this.resize);
    this.resize();
  }

  private resize = (): void => {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  };
}

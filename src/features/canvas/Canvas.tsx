import { useEffect, useRef } from 'react';
import { CanvasHelper } from './CanvasHelper';
import styles from './Canvas.module.scss';
import { Adapter } from '../editor/Adapter';
import { Renderer } from './Renderer';
import { InteractionManager } from './InteractionManager';
import { findToolName } from './utils';
import { ToolFactory } from './tools/ToolFactory';

let canvasHelper: CanvasHelper;
let renderer: Renderer;
let interactionManager: InteractionManager;

const setup = (canvas: HTMLCanvasElement, source: Adapter) => {
  renderer = new Renderer(source);

  canvasHelper = new CanvasHelper(canvas, source);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  interactionManager = new InteractionManager(canvas.getContext('2d')!, source);

  canvasHelper.addEventListener('render', (ctx) => {
    source.size = [canvas.offsetWidth, canvas.offsetHeight];
    renderer.render(ctx);
  });

  interactionManager.addEventListener('interaction', (interaction) => {
    const toolName = findToolName(interaction.target);
    const tool = ToolFactory.get(toolName);
    tool.source = source;

    interactionManager.tool = tool;
    tool.handleMouseDown(interaction);
  });
};

const destroy = () => {
  canvasHelper.destroy();
  interactionManager.destroy();
};

export const Canvas = ({ adapter }: { adapter: Adapter }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setup(ref.current!, adapter);
    return destroy;
  }, []);

  return <canvas ref={ref} className={styles.canvas} />;
};

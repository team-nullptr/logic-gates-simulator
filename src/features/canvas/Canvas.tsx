import { useEffect, useRef } from "react";
import { CanvasHelper } from "./CanvasHelper";
import styles from "./Canvas.module.scss";
import { Adapter } from "../editor/Adapter";
import { Renderer } from "./Renderer";
import { InteractionManager } from "./InteractionManager";

let canvasHelper: CanvasHelper;
let renderer: Renderer;
let interactionManager: InteractionManager;

const setup = (canvas: HTMLCanvasElement, source: Adapter) => {
  canvasHelper = new CanvasHelper(canvas);
  renderer = new Renderer(source);
  interactionManager = new InteractionManager(canvas.getContext("2d")!, source);

  canvasHelper.addEventListener("render", (ctx) => {
    canvasHelper.offset = interactionManager.offset;
    renderer.render(ctx);
  });
};

const destroy = () => {
  canvasHelper.destroy();
  interactionManager.destroy();
};

export const Canvas = ({ adapter }: { adapter: Adapter }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setup(ref.current!, adapter);
    return destroy;
  }, []);

  return <canvas ref={ref} className={styles.canvas} />;
};

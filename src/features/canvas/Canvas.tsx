import { useEffect, useRef } from "react";
import { Renderer } from "./Renderer";
import styles from "./Canvas.module.scss";
import { Manager } from "../editor/Manager";

export const Canvas = ({ manager }: { manager: Manager }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  let renderer: Renderer;

  useEffect(() => {
    renderer = new Renderer(ref.current!, manager);
    return () => renderer.destroy();
  }, []);

  return <canvas ref={ref} className={styles.canvas} />;
};

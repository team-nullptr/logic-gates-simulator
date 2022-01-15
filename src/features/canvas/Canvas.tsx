import { useEffect, useRef } from "react";
import { Renderer } from "./Renderer";
import styles from "./Canvas.module.scss";
import { Manager } from "./Manager";

export const Canvas = () => {
  let renderer: Renderer;

  const ref = useRef<HTMLCanvasElement>(null);
  const manager = new Manager();

  useEffect(() => {
    renderer = new Renderer(ref.current!, manager);
    return () => renderer.destroy();
  }, []);

  return <canvas ref={ref} className={styles.canvas} />;
};

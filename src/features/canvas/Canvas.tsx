import { useEffect, useRef } from "react";
import { Renderer } from "./Renderer";
import styles from "./Canvas.module.scss";

export const Canvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  let renderer: Renderer;

  useEffect(() => {
    renderer = new Renderer(ref.current!);
    return () => renderer.destroy();
  }, []);

  return <canvas ref={ref} className={styles.canvas} />;
};

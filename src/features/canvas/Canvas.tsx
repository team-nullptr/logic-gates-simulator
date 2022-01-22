import { useEffect, useRef } from "react";
import { Renderer } from "./Renderer";
import styles from "./Canvas.module.scss";
import { Adapter } from "../editor/Adapter";

export const Canvas = ({ adapter }: { adapter: Adapter }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  let renderer: Renderer;

  useEffect(() => {
    renderer = new Renderer(ref.current!, adapter);
    return () => renderer.destroy();
  }, []);

  return <canvas ref={ref} className={styles.canvas} />;
};

import { Sidebar } from "../../features/sidebar/Sidebar";
import styles from "./Editor.module.scss";
import { Canvas } from "../../features/canvas/Canvas";

export const Editor = () => {
  return (
    <main className={styles.container}>
      <div className={styles.canvas}>
        <Canvas />
      </div>
      <Sidebar />
    </main>
  );
};

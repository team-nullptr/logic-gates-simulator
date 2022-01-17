import { Sidebar } from "../sidebar/Sidebar";
import styles from "./Editor.module.scss";
import { Canvas } from "../canvas/Canvas";
import { Manager } from "./Manager";

export const Editor = () => {
  const manager = new Manager();

  return (
    <main className={styles.container}>
      <div className={styles.canvas}>
        <Canvas manager={manager} />
      </div>
      <Sidebar />
    </main>
  );
};

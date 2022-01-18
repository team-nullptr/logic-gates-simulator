import { Sidebar } from "../sidebar/Sidebar";
import styles from "./Editor.module.scss";
import { Canvas } from "../canvas/Canvas";
import { Manager } from "./Manager";
import { Controls } from "./Controls";

export const Editor = () => {
  const manager = new Manager();

  return (
    <main className={styles.container}>
      <Controls buttons={[]} section="inputs" />
      <div className={styles.canvas}>
        <Canvas manager={manager} />
      </div>
      <Controls buttons={[]} section="outputs" />
      <Sidebar />
    </main>
  );
};

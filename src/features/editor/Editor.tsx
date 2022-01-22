import { Sidebar } from "../sidebar/Sidebar";
import styles from "./Editor.module.scss";
import { Canvas } from "../canvas/Canvas";
import { Adapter } from "./Adapter";
import { Controls } from "./Controls";

export const Editor = () => {
  const adapter = new Adapter();

  return (
    <main className={styles.container}>
      <Controls buttons={adapter.inputs} section="inputs" />
      <div className={styles.canvas}>
        <Canvas adapter={adapter} />
      </div>
      <Controls buttons={adapter.outputs} section="outputs" />
      <Sidebar />
    </main>
  );
};

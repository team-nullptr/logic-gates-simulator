import { Sidebar } from "../sidebar/Sidebar";
import styles from "./Editor.module.scss";
import { Canvas } from "../canvas/Canvas";
import { Adapter } from "./Adapter";
import { Controls } from "./Controls";
import { useRef } from "react";

export const Editor = () => {
  const inputScroll = useRef<number>(0);
  const outputScroll = useRef<number>(0);

  const adapter = new Adapter({ inputs: inputScroll, outputs: outputScroll });

  return (
    <main className={styles.container}>
      <Controls
        buttons={adapter.buttons.filter((it) => it.side === "output")}
        section="inputs"
        scroll={inputScroll}
      />
      <div className={styles.canvas}>
        <Canvas adapter={adapter} />
      </div>
      <Controls
        buttons={adapter.buttons.filter((it) => it.side === "input")}
        section="outputs"
        scroll={outputScroll}
      />
      <Sidebar />
    </main>
  );
};

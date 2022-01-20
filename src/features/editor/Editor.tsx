import { Sidebar } from "../sidebar/Sidebar";
import styles from "./Editor.module.scss";
import { Canvas } from "../canvas/Canvas";
import { Manager } from "./Manager";
import { Controls } from "./Controls";
import { CompoundButton } from "./types/CompoundButton";
import { SingleButton } from "./types/SingleButton";

export const Editor = () => {
  const manager = new Manager();

  const inputs: (CompoundButton | SingleButton)[] = [
    {
      id: "11ec",
      type: "single",
      value: true,
      letter: "A",
    },
    {
      id: "90d6",
      type: "single",
      value: false,
      letter: "B",
    },
    {
      id: "81d6",
      type: "single",
      value: true,
      letter: "C",
    },
    {
      id: "94d6",
      type: "single",
      value: true,
      letter: "D",
    },
    {
      id: "41ac",
      type: "compound",
      value: 2,
      length: 4,
    },
    {
      id: "90d8",
      type: "single",
      value: true,
      letter: "E",
    },
  ];

  const outputs: (CompoundButton | SingleButton)[] = [
    {
      id: "91ec",
      type: "single",
      value: true,
      letter: "A",
    },
    {
      id: "31ac",
      type: "compound",
      value: 10,
      length: 2,
    },
    {
      id: "32ec",
      type: "single",
      value: false,
      letter: "B",
    },
  ];

  return (
    <main className={styles.container}>
      <Controls buttons={inputs} section="inputs" />
      <div className={styles.canvas}>
        <Canvas manager={manager} />
      </div>
      <Controls buttons={outputs} section="outputs" />
      <Sidebar />
    </main>
  );
};

import { Sidebar } from "../../features/sidebar/Sidebar";
import styles from "./Editor.module.scss";

export const Editor = () => (
  <main className={styles.container}>
    <div className={styles.canvas} />
    <Sidebar />
  </main>
);

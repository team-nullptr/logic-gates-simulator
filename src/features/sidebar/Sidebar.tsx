import { ListHeader } from "./ListHeader";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => (
  <div className={styles.sidebar}>
    <ListHeader text="Input/Output" />
    <ListHeader text="Basic gates" />
    <ListHeader text="Custom gates" />
  </div>
);

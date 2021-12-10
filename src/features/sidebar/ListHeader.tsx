import { FC } from "react";
import styles from "./List.module.scss";

export const ListHeader: FC<{ text: string }> = ({ text }) => (
  <p className={styles.header}>{text}</p>
);

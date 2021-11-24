import { FC } from "react";
import styles from "./List.module.scss";

export const ListHeader: FC<{ text: string }> = ({ text }) => {
  return <p className={styles.header}>{text}</p>;
};

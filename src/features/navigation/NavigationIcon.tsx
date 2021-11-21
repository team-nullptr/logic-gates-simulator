import { FC } from "react";
import { Icon } from "react-feather";
import styles from "./Navigation.module.scss";

export const NavigationIcon: FC<{
  icon: Icon;
  text?: string;
  onClick: () => void;
}> = (props) => (
  <button className={`${styles.button} ${props.text ? styles.expanded : ""}`}>
    <props.icon className={styles.icon} onClick={props.onClick} />
    {props.text && <span className={styles.text}>{props.text}</span>}
  </button>
);

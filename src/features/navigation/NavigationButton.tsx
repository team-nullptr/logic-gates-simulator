import { FC } from 'react';
import { Icon } from 'react-feather';
import styles from './Navigation.module.scss';

export const NavigationButton: FC<{
  icon: Icon;
  text?: string;
  onClick: () => void;
}> = (props) => (
  <button
    onClick={props.onClick}
    className={`${styles.button} ${props.text ? styles.expanded : ''}`}
  >
    <props.icon className={styles.icon} />
    {props.text && <span className={styles.text}>{props.text}</span>}
  </button>
);

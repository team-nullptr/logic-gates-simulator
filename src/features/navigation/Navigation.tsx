import { FC } from "react";
import { NavigationItem } from "../../common/models/NavigationItem";
import { Home, Icon } from "react-feather";
import styles from "./Navigation.module.scss";

type NavigationProps = {
  title: string;
  onHomeClicked: () => void;
  actions: NavigationItem[];
};

const NavigationIcon: FC<{ icon: Icon; text?: string; onClick: () => void }> = (
  props
) => (
  <button className={`${styles.button} ${props.text ? styles.expanded : ""}`}>
    <props.icon className={styles.icon} onClick={props.onClick} />
    {props.text && <span className={styles.text}>{props.text}</span>}
  </button>
);

export const Navigation: FC<NavigationProps> = (props) => {
  const renderActions = () => {
    return props.actions.map((action, i) => (
      <NavigationIcon
        icon={action.icon}
        onClick={action.onClick}
        text={action.text}
        key={i}
      />
    ));
  };

  return (
    <nav className={styles.navigation}>
      <NavigationIcon icon={Home} onClick={props.onHomeClicked} />
      <p className={styles.title}>{props.title}</p>
      <div className={styles.actions}>{renderActions()}</div>
    </nav>
  );
};

import { FC } from "react";
import { NavigationItem } from "../../common/models/NavigationItem";
import styles from "./Navigation.module.scss";
import { NavigationButton } from "./NavigationButton";

type NavigationProps = {
  title: string;
  left: NavigationItem[];
  right: NavigationItem[];
};

export const Navigation: FC<NavigationProps> = (props) => {
  const renderActions = (actions: NavigationItem[]) => {
    return actions.map((action, i) => (
      <NavigationButton
        icon={action.icon}
        onClick={action.onClick}
        text={action.text}
        key={i}
      />
    ));
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.actions}>{renderActions(props.left)}</div>
      <p className={styles.title}>{props.title}</p>
      <div className={styles.actions}>{renderActions(props.right)}</div>
    </nav>
  );
};

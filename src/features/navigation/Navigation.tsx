import { FC } from "react";
import { NavigationItem } from "../../common/models/NavigationItem";
import { Home } from "react-feather";
import styles from "./Navigation.module.scss";
import { NavigationIcon } from "./NavigationIcon";

type NavigationProps = {
  title: string;
  onHomeClicked: () => void;
  actions: NavigationItem[];
};

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

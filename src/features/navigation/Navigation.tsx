import { FC } from "react";
import { NavigationItem } from "../../common/models/NavigationItem";
import { Home } from "react-feather";

type NavigationProps = {
  title: string;
  onHomeClicked: () => void;
  actions: NavigationItem[];
};

export const Navigation: FC<NavigationProps> = (props) => {
  const renderActions = () => {
    return props.actions.map((action, i) => {
      if (!action.text) {
        return <action.icon onClick={action.onClick} key={i} />;
      }

      return (
        <button onClick={action.onClick} key={i}>
          {<action.icon />}
          {action.text}
        </button>
      );
    });
  };

  return (
    <nav>
      <Home onClick={props.onHomeClicked} />
      <p>{props.title}</p>
      <div>{renderActions()}</div>
    </nav>
  );
};

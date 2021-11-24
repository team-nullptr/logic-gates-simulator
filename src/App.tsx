import "./common/styles/index.css";
import { Editor } from "./screens/editor/Editor";
import { GitMerge, Plus } from "react-feather";
import { Navigation } from "./features/navigation/Navigation";
import styles from "./App.module.scss";

export const App = () => {
  return (
    <div className={styles.container}>
      <Navigation
        title={"My first circuit"}
        onHomeClicked={() => console.log("home clicked")}
        actions={[
          {
            icon: Plus,
            text: "Create gate",
            onClick: () => console.log("create gate clicked"),
          },
          { icon: GitMerge, onClick: () => console.log("cleanup clicked") },
        ]}
      />
      <Editor />
    </div>
  );
};

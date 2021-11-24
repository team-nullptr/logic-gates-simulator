import "./common/styles/index.css";
import { Editor } from "./screens/editor/Editor";
import { Navigation } from "./features/navigation/Navigation";
import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import { GitMerge, Home, Plus } from "react-feather";

export const App = () => {
  return (
    <div className={styles.container}>
      <Navigation
        title={"My first circuit"}
        left={[
          {
            icon: Home,
            onClick: () => console.log("home clicked"),
          },
        ]}
        right={[
          {
            icon: Plus,
            text: "Create gate",
            onClick: () => console.log("create gate clicked"),
          },
          {
            icon: GitMerge,
            onClick: () => console.log("cleanup clicked"),
          },
        ]}
      />
      <Routes>
        <Route path="/" element={<Editor />} />
      </Routes>
    </div>
  );
};

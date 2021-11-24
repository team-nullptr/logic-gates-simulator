import "./main.css";
import { Editor } from "./screens/editor/Editor";
import styles from "./App.module.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import { renderNavigation } from "./utils/renderNavigation";

export const App = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      {renderNavigation(location.pathname)}
      <Routes>
        <Route path="/" element={<h1>Projects</h1>} />
        <Route path="/edit" element={<Editor />} />
      </Routes>
    </div>
  );
};

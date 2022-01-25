import './main.css';
import { Editor } from './screens/editor/Editor';
import styles from './App.module.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderNavigation } from './utils/renderNavigation';
import { useEffect } from 'react';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    // TODO: Find a better way to initialize storage.
    localStorage.setItem('saved-gates', JSON.stringify({}));
  });

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

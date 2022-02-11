import './main.css';
import { Editor } from './features/editor/Editor';
import styles from './App.module.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderNavigation } from './utils/renderNavigation';
import { Dashboard } from './features/dashboard/Dashboard';

export const App = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      {renderNavigation(location.pathname)}
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/edit' element={<Editor />} />
      </Routes>
    </div>
  );
};

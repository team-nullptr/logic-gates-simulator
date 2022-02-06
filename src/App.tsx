import './main.css';
import { Editor } from './screens/editor/Editor';
import styles from './App.module.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderNavigation } from './utils/renderNavigation';
import { useEffect } from 'react';
import { Circuit } from './core/simulator/circuit';
import { serialize } from './core/simulator/util/serialization';
import { fetchGates } from './core/simulator/util/fetch-gates';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(fetchGates());

    // TODO: Find a better way to initialize storage.
    localStorage.setItem('saved-gates', JSON.stringify({}));

    const circuit = new Circuit();

    circuit.add('input');

    serialize('dupa', circuit);

    console.log(circuit);
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

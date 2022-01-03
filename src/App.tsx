import './main.css';
import { Editor } from './screens/editor/Editor';
import styles from './App.module.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderNavigation } from './utils/renderNavigation';
import { useEffect } from 'react';
import { Simulator } from './core/simulator/simulator';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    const simulator = new Simulator();

    const a = simulator.add('input');
    simulator.toggle(a);

    const c = simulator.add('nor');

    simulator.connect({
      emitterId: a,
      receiverId: c,
      from: 0,
      to: 0
    });

    console.log(simulator.circuit);
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

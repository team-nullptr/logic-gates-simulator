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
    const b = simulator.add('input');

    const c = simulator.add('nand');
    const d = simulator.add('nand');

    simulator.connect({
      emitterId: a,
      receiverId: c,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: b,
      receiverId: d,
      from: 0,
      to: 1
    });

    simulator.connect({
      emitterId: c,
      receiverId: d,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: d,
      receiverId: c,
      from: 0,
      to: 1
    });

    simulator.disconnect({
      elementId: a,
      targetId: c,
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

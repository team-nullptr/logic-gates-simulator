import './main.css';
import { Editor } from './screens/editor/Editor';
import styles from './App.module.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderNavigation } from './utils/renderNavigation';
import { useEffect } from 'react';
import { Circuit } from './core/simulator/circuit';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    const circuit = new Circuit();

    const g = circuit.add('input-group');
    const ge = circuit.find(g);
    if (ge) {
      ge.states[0] = true;
      ge.states[1] = true;
      ge.states[2] = false;
      ge.states[3] = true;
    }

    const a = circuit.add('input');

    // a element
    const ae = circuit.find(a);
    if (ae) ae.states[0] = true;

    const b = circuit.add('input');

    const c = circuit.add('nand');
    const d = circuit.add('nand');

    circuit.connect({
      emitterId: a,
      receiverId: c,
      from: 0,
      to: 0
    });

    circuit.connect({
      emitterId: b,
      receiverId: d,
      from: 0,
      to: 1
    });

    circuit.connect({
      emitterId: c,
      receiverId: d,
      from: 0,
      to: 0
    });

    circuit.connect({
      emitterId: d,
      receiverId: c,
      from: 0,
      to: 1
    });

    // circuit.disconnect({
    //   elementId: a,
    //   targetId: c,
    //   from: 0,
    //   to: 0
    // });

    // console.log(circuit.allElements);

    console.log(circuit.allElements);
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

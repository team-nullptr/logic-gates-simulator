import './main.css';
import { Editor } from './screens/editor/Editor';
import styles from './App.module.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderNavigation } from './utils/renderNavigation';
import { useEffect } from 'react';
import { Circuit } from './core/simulator/Circuit';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    // TODO: Find a better way to initialize storage.
    localStorage.setItem('saved-gates', JSON.stringify({}));

    const circuit = new Circuit();

    circuit.subscribe(() => {
      console.log(circuit.allElements);
    });

    const a = circuit.add('input');

    // toggle input a
    const ae = circuit.find(a);
    ae!.states[0] = true;

    const b = circuit.add('input');

    const c = circuit.add('or');
    const d = circuit.add('not');

    const e = circuit.add('or');
    const f = circuit.add('not');

    circuit.connect({
      emitterId: a,
      receiverId: c,
      from: 0,
      to: 0
    });

    circuit.connect({
      emitterId: c,
      receiverId: d,
      from: 0,
      to: 0
    });

    circuit.connect({
      emitterId: b,
      receiverId: e,
      from: 0,
      to: 1
    });

    circuit.connect({
      emitterId: e,
      receiverId: f,
      from: 0,
      to: 0
    });

    circuit.connect({
      emitterId: f,
      receiverId: c,
      from: 0,
      to: 1
    });

    circuit.connect({
      emitterId: d,
      receiverId: e,
      from: 0,
      to: 0
    });
  });

  return (
    <div className={styles.container}>
      {renderNavigation(location.pathname)}
      <Routes>
        <Route path="/" element={<p>a</p>} />
        <Route path="/edit" element={<Editor />} />
      </Routes>
    </div>
  );
};

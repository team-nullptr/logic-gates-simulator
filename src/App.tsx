import './main.css';
import { Editor } from './screens/editor/Editor';
import styles from './App.module.scss';
import { Route, Routes, useLocation } from 'react-router-dom';
import { renderNavigation } from './utils/renderNavigation';
import { useEffect } from 'react';
import { Simulator } from './core/simulator/Simulator';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    const simulator = new Simulator();

    const a = simulator.add('input');
    simulator.toggleInput(a);

    const b = simulator.add('input');

    const c = simulator.add('or');
    const d = simulator.add('not');

    const e = simulator.add('or');
    const f = simulator.add('not');

    const g = simulator.add('output');
    const h = simulator.add('output');

    simulator.connect({
      emitterId: a,
      receiverId: c,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: c,
      receiverId: d,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: d,
      receiverId: g,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: b,
      receiverId: e,
      from: 0,
      to: 1
    });

    simulator.connect({
      emitterId: f,
      receiverId: h,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: e,
      receiverId: f,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: f,
      receiverId: c,
      from: 0,
      to: 1
    });

    simulator.connect({
      emitterId: d,
      receiverId: e,
      from: 0,
      to: 0
    });

    simulator.disconnect({
      elementId: a,
      targetId: c,
      from: 0,
      to: 0
    });

    console.log('circuit');
    console.log(simulator.circuit);

    console.log("serialized simulator's circuit");
    console.log(simulator.circuit);
    console.log(simulator.circuit.serialize());

    console.log('creating gate from circuit');
    simulator.createGate('test-gate', '#8c57cc');
    console.log(simulator);

    console.log('with test gate in circuit:');
    const aa = simulator.add('test-gate');
    console.log(simulator.circuit);

    const bb = simulator.add('input');
    simulator.toggleInput(bb);

    const cc = simulator.add('input');

    const dd = simulator.add('output');
    const ee = simulator.add('output');

    simulator.connect({
      emitterId: bb,
      receiverId: aa,
      from: 0,
      to: 0
    });

    simulator.connect({
      emitterId: cc,
      receiverId: aa,
      from: 0,
      to: 1
    });

    console.log('simulator with custom gate and inputs', simulator);
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

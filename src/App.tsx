import styles from './App.module.scss';
import { Editor } from './features/editor/Editor';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { Dashboard } from './features/dashboard/Dashboard';
import { MessageBusRenderer } from './features/message-bus/MessageBusRenderer';
import { GlobalStyle } from './styles/globalStyle';
import { Simulator } from './core/simulator/Simulator';

export const App = () => {
  useEffect(() => {
    const simulator = new Simulator();

    const a = simulator.addPort('input');
    const b = simulator.addPort('input');

    const c = simulator.addGate('or');
    const d = simulator.addGate('not');

    const e = simulator.addGate('or');
    const f = simulator.addGate('not');

    const g = simulator.addPort('output');
    const h = simulator.addPort('output');

    console.log(simulator.circuit);

    // simulator.toggleInput(a);
    // simulator.renamePort(a, 'A');
    //
    // simulator.connect({
    //   emitterId: a,
    //   receiverId: c,
    //   from: 0,
    //   to: 0
    // });
    //
    // simulator.connect({
    //   emitterId: c,
    //   receiverId: d,
    //   from: 0,
    //   to: 0
    // });
    //
    // simulator.connect({
    //   emitterId: d,
    //   receiverId: g,
    //   from: 0,
    //   to: 0
    // });
    //
    // simulator.connect({
    //   emitterId: b,
    //   receiverId: e,
    //   from: 0,
    //   to: 1
    // });
    //
    // simulator.connect({
    //   emitterId: f,
    //   receiverId: h,
    //   from: 0,
    //   to: 0
    // });
    //
    // simulator.connect({
    //   emitterId: e,
    //   receiverId: f,
    //   from: 0,
    //   to: 0
    // });
    //
    // simulator.connect({
    //   emitterId: f,
    //   receiverId: c,
    //   from: 0,
    //   to: 1
    // });
    //
    // simulator.connect({
    //   emitterId: d,
    //   receiverId: e,
    //   from: 0,
    //   to: 0
    // });
    //
    // console.log(simulator.circuit);
    //
    // simulator.createGate('test', '#ff00ff');
    //
    // simulator.addGate('test');
    //
    // console.log(simulator.circuit);
  }, []);

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <div className={styles.container}>
        <MessageBusRenderer />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="edit/:projectId" element={<Editor />} />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </div>
    </>
  );
};

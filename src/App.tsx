import './main.css';
import styles from './App.module.scss';
import { Editor } from './features/editor/Editor';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Dashboard } from './features/dashboard/Dashboard';
import { MessageBusRenderer } from './features/message-bus/MessageBusRenderer';
import { NavigationResolver } from './features/navigation/NavigationResolver';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    // projectManager.createProject('test');
    // const a = simulator.add('input');
    // simulator.toggleInput(a);
    //
    // const b = simulator.add('input');
    //
    // const c = simulator.add('or');
    // const d = simulator.add('not');
    //
    // const e = simulator.add('or');
    // const f = simulator.add('not');
    //
    // const g = simulator.add('output');
    // const h = simulator.add('output');
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
    // simulator.remove(f);
  }, []);

  return (
    <div className={styles.container}>
      <MessageBusRenderer />
      <NavigationResolver path={location.pathname} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="edit/:projectId" element={<Editor />} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </div>
  );
};

import { Sidebar } from '../sidebar/Sidebar';
import styles from './Editor.module.scss';
import { Canvas } from '../canvas/Canvas';
import { Adapter } from './Adapter';
import { Controls } from './Controls';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Project } from '../../core/project-manager/ProjectManager';
import { EditorNavigation } from './EditorNavigation';
import { Connectors } from './Connectors';
import { Button } from '../canvas/types/Button';

export const Editor = ({ project }: { project: Project }) => {
  const [scrolls, setScrolls] = useState({ inputs: 0, outputs: 0 });
  const scrollsRef = useRef(scrolls);

  const adapter = useMemo(() => new Adapter(project, scrollsRef), []);

  const [inputs, setInputs] = useState<Button[]>([]);
  const [outputs, setOutputs] = useState<Button[]>([]);

  useEffect(() => {
    const subscriber = () => {
      setInputs(adapter.inputs);
      setOutputs(adapter.outputs);
    };

    adapter.subscribe(subscriber);
    return () => adapter.unsubscribe(subscriber);
  }, []);

  const scrollHandler = (side: 'inputs' | 'outputs', value: number) => {
    const updated = { ...scrolls, [side]: value };
    scrollsRef.current = updated;
    setScrolls(updated);
  };

  return (
    <>
      <EditorNavigation title={project.name} onCreateGate={() => project.simulator.createGate('test', 'red')} />
      <main className={styles.container}>
        <Controls
          buttons={inputs}
          section="inputs"
          onAdd={(connectors) => adapter.addPort('input', connectors)}
          onToggle={(button, index) => adapter.toggleInput(button.id, index)}
          onScroll={(value) => scrollHandler('inputs', value)}
        />
        <div className={styles.wrapper}>
          <div className={styles.side} style={{ left: 0 }}>
            <Connectors buttons={inputs} top={scrolls.inputs} />
          </div>
          <div className={styles.canvas}>
            <Canvas adapter={adapter} />
          </div>
          <div className={styles.side} style={{ right: 0 }}>
            <Connectors buttons={outputs} top={scrolls.outputs} />
          </div>
        </div>
        <Controls
          buttons={outputs}
          section="outputs"
          onAdd={(connectors) => adapter.addPort('output', connectors)}
          onToggle={(button, index) => adapter.toggleInput(button.id, index)}
          onScroll={(value) => scrollHandler('outputs', value)}
        />
        <Sidebar source={adapter} />
      </main>
    </>
  );
};

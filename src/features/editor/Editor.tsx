import { Sidebar } from '../sidebar/Sidebar';
import styles from './Editor.module.scss';
import { Canvas } from '../canvas/Canvas';
import { Adapter } from './Adapter';
import { Controls } from './Controls';
import { useMemo, useRef, useState } from 'react';
import { Project } from '../../core/project-manager/ProjectManager';
import { EditorNavigation } from './EditorNavigation';
import { Connectors } from './Connectors';

export const Editor = ({ project }: { project: Project }) => {
  const [scrolls, setScrolls] = useState({ inputs: 0, outputs: 0 });
  const scrollsRef = useRef(scrolls);

  const adapter = useMemo(() => new Adapter(project, scrollsRef), []);

  const outputs = adapter.buttons.filter((it) => it.side === 'input');
  const inputs = adapter.buttons.filter((it) => it.side === 'output');

  const scrollHandler = (side: 'inputs' | 'outputs', value: number) => {
    const updated = { ...scrolls, [side]: value };
    scrollsRef.current = updated;
    setScrolls(updated);
  };

  return (
    <>
      <EditorNavigation title={project.name} />
      <main className={styles.container}>
        <Controls buttons={inputs} section="inputs" onScroll={(value) => scrollHandler('inputs', value)} />
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
        <Controls buttons={outputs} section="outputs" onScroll={(value) => scrollHandler('outputs', value)} />
        <Sidebar source={adapter} />
      </main>
    </>
  );
};

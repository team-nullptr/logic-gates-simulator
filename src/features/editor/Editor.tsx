import { Sidebar } from '../sidebar/Sidebar';
import styles from './Editor.module.scss';
import { Canvas } from '../canvas/Canvas';
import { Adapter } from './Adapter';
import { Controls } from './Controls';
import { useEffect, useRef, useState } from 'react';
import { Project, projectManager } from '../../core/project-manager/ProjectManager';
import { useNavigate, useParams } from 'react-router-dom';
import { messageBus } from '../message-bus/MessageBus';

interface EditorPageParams {
  projectId: string;
}

export const Editor = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<keyof EditorPageParams>() as EditorPageParams;
  const [project, setProject] = useState<Project>();

  const inputScroll = useRef<number>(0);
  const outputScroll = useRef<number>(0);

  const adapter = new Adapter({ inputs: inputScroll, outputs: outputScroll });

  useEffect(() => {
    try {
      const project = projectManager.loadProject(projectId);
      setProject(project);
    } catch (err) {
      messageBus.push({
        type: 'error',
        body: 'Failed to open the project'
      });
      navigate('/');
    }
  }, []);

  return (
    <main className={styles.container}>
      <Controls buttons={adapter.buttons.filter((it) => it.side === 'output')} section="inputs" scroll={inputScroll} />
      <div className={styles.canvas}>
        <Canvas adapter={adapter} />
      </div>
      <Controls buttons={adapter.buttons.filter((it) => it.side === 'input')} section="outputs" scroll={outputScroll} />
      <Sidebar />
    </main>
  );
};

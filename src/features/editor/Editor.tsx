import { Sidebar } from '../sidebar/Sidebar';
import styles from './Editor.module.scss';
import { Canvas } from '../canvas/Canvas';
import { Adapter } from './Adapter';
import { Controls } from './Controls';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Project, projectManager } from '../../core/project-manager/ProjectManager';
import { Connectors } from './Connectors';
import { Button } from '../canvas/types/Button';
import { GateEditorNavigation } from './GateEditorNavigation';
import { EditorNavigation } from './EditorNavigation';
import { CreateGateForm, GateCreateHandler } from './CreateGateForm';
import { messageBus } from '../message-bus/MessageBus';

export const Editor = ({ project }: { project: Project }) => {
  const [scrolls, setScrolls] = useState({ inputs: 0, outputs: 0 });
  const scrollsRef = useRef(scrolls);

  const [createGateFormOpen, setCreateGateFormOpen] = useState(false);

  const adapter = useMemo(() => new Adapter(project, scrollsRef), []);

  const [inputs, setInputs] = useState<Button[]>(adapter.inputs);
  const [outputs, setOutputs] = useState<Button[]>(adapter.outputs);

  useEffect(() => {
    const subscriber = () => {
      setInputs(adapter.inputs);
      setOutputs(adapter.outputs);
    };

    adapter.subscribe(subscriber);
    return () => adapter.unsubscribe(subscriber);
  }, []);

  useEffect(() => {
    const subscriber = () => {
      projectManager.saveProject(project);
    };

    project.simulator.subscribe(subscriber);
    return () => project.simulator.unsubscribe(subscriber);
  }, []);

  const handleGateEdit = (type: string) => {
    if (project.simulator.meta.mode === 'GATE_EDIT') return;
    adapter.editCreatedGate(type);
  };

  const scrollHandler = (side: 'inputs' | 'outputs', value: number) => {
    const updated = { ...scrolls, [side]: value };
    scrollsRef.current = updated;
    setScrolls(updated);
  };

  const gateCreateHandler: GateCreateHandler = ({ name, color }) => {
    if (name.length < 1 || name.length > 8) {
      messageBus.push({ type: 'error', body: 'Name must be between 1 and 8 characters long' });
      return;
    }

    adapter.createGate(name, color);
    console.log(project.simulator.createdGates);
    setCreateGateFormOpen(false);
  };

  const renderNavigation = () => {
    const { meta } = project.simulator;

    if (meta.mode === 'PROJECT_EDIT') {
      return (
        <EditorNavigation
          title={project.name}
          onRename={(value) => console.log('gate renamed to', value)}
          onCleanup={() => console.log('cleanup clicked')}
          onCreateGate={() => setCreateGateFormOpen(true)}
        />
      );
    }

    return (
      <GateEditorNavigation
        onBack={() => adapter.updateCreatedGate()}
        onCancel={() => adapter.cancelCreatedGateUpdate()}
        title={project.name}
        gateName={meta.editedGate.name}
        onRename={(value) => adapter.renameCreatedGate(meta.editedGate.type, value)}
        onCleanup={() => console.log('cleanup clicked')}
      />
    );
  };

  return (
    <>
      {renderNavigation()}
      <main className={styles.container}>
        <Controls
          buttons={inputs}
          section="inputs"
          onAdd={(connectors) => adapter.addPort('input', connectors)}
          onDelete={(id) => adapter.removePort(id)}
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
          onDelete={(id) => adapter.removePort(id)}
          onToggle={(button, index) => adapter.toggleInput(button.id, index)}
          onScroll={(value) => scrollHandler('outputs', value)}
        />
        <Sidebar
          available={adapter.available}
          onEdit={handleGateEdit}
          onDelete={(type) => adapter.removeCreatedGate(type)}
        />
      </main>
      {createGateFormOpen && (
        <CreateGateForm onSubmit={gateCreateHandler} onCancel={() => setCreateGateFormOpen(false)} />
      )}
    </>
  );
};

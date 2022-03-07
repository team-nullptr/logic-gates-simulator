import { Sidebar } from '../sidebar/Sidebar';
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
import { StyledCanvas, StyledMain, StyledSide, StyledWrapper } from './Editor.styles';

export const Editor = ({ project }: { project: Project }) => {
  const [scrolls, setScrolls] = useState({ inputs: 0, outputs: 0 });
  const scrollsRef = useRef(scrolls);

  const [createGateFormOpen, setCreateGateFormOpen] = useState(false);

  const adapter = useMemo(() => new Adapter(project, scrollsRef), []);

  const [inputs, setInputs] = useState<Button[]>(adapter.inputs);
  const [outputs, setOutputs] = useState<Button[]>(adapter.outputs);

  useEffect(() => {
    projectManager.saveProject(project);
  }, []);

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
    adapter.editCustomGate(type);
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

    adapter.createCustomGate(name, color);
    console.log(project.simulator.createdGates);
    setCreateGateFormOpen(false);
  };

  const handleProjectRename = (name: string) => {
    project.name = name;
    projectManager.saveProject(project);
  };

  const renderNavigation = () => {
    const { meta } = project.simulator;

    if (meta.mode === 'PROJECT_EDIT') {
      return (
        <EditorNavigation
          title={project.name}
          labels={adapter.labels}
          onRename={handleProjectRename}
          onCreateGate={() => setCreateGateFormOpen(true)}
          onLabelToggle={() => adapter.toggleLabels()}
          onCleanup={() => adapter.cleanup()}
        />
      );
    }

    return (
      <GateEditorNavigation
        onBack={() => adapter.updateCustomGate()}
        onCancel={() => adapter.cancelCustomGateUpdate()}
        title={project.name}
        gateName={meta.editedGate.name}
        labels={adapter.labels}
        onRename={(value) => adapter.renameCustomGate(meta.editedGate.type, value)}
        onLabelToggle={() => adapter.toggleLabels()}
        onCleanup={() => adapter.cleanup()}
      />
    );
  };

  return (
    <>
      {renderNavigation()}
      <StyledMain>
        <Controls section="inputs" source={adapter} onScroll={(value) => scrollHandler('inputs', value)} />
        <StyledWrapper>
          <StyledSide style={{ left: 0 }}>
            <Connectors buttons={inputs} top={scrolls.inputs} />
          </StyledSide>
          <StyledCanvas>
            <Canvas adapter={adapter} />
          </StyledCanvas>
          <StyledSide style={{ right: 0 }}>
            <Connectors buttons={outputs} top={scrolls.outputs} />
          </StyledSide>
        </StyledWrapper>
        <Controls section="outputs" source={adapter} onScroll={(value) => scrollHandler('outputs', value)} />
        <Sidebar
          available={adapter.availableGates}
          onEdit={handleGateEdit}
          onDelete={(type) => adapter.removeCustomGate(type)}
        />
      </StyledMain>
      {createGateFormOpen && (
        <CreateGateForm onSubmit={gateCreateHandler} onCancel={() => setCreateGateFormOpen(false)} />
      )}
    </>
  );
};

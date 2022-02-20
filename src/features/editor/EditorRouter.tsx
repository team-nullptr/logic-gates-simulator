import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project, projectManager } from '../../core/project-manager/ProjectManager';
import { messageBus } from '../message-bus/MessageBus';
import { Editor } from './Editor';

export const EditorRouter = () => {
  const navigate = useNavigate();
  const params = useParams<'id'>();

  const [project, setProject] = useState<Project>();

  useEffect(() => {
    try {
      const loaded = projectManager.loadProject(params.id || '');
      setProject(loaded);
    } catch (err) {
      messageBus.push({ type: 'error', body: 'Failed to open the project' });
      navigate('/');
    }
  }, []);

  if (project) return <Editor project={project} />;
  return <p>Loading, please wait</p>;
};

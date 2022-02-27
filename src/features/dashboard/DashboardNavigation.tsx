import { useNavigate } from 'react-router-dom';
import { projectManager } from '../../core/project-manager/ProjectManager';
import { messageBus } from '../message-bus/MessageBus';
import { Navigation } from '../navigation/Navigation';
import { Plus } from 'react-feather';

export const DashboardNavigation = () => {
  const navigate = useNavigate();

  const createProject = () => {
    try {
      const id = projectManager.createProject('Untitled');
      messageBus.push({ type: 'success', body: 'A new project has been created successfully' });
      navigate(`/editor/${id}`);
    } catch (err) {
      messageBus.push({ type: 'error', body: 'Failed to create a new project' });
    }
  };

  return (
    <Navigation left={[]} right={[{ icon: Plus, text: 'New project', onClick: () => createProject() }]}>
      <span>Projects</span>
    </Navigation>
  );
};

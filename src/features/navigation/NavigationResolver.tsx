import { GitMerge, Home, Plus, ArrowLeft } from 'react-feather';
import { Navigation } from './Navigation';
import { useNavigate } from 'react-router-dom';
import { projectManager } from '../../core/project-manager/ProjectManager';
import { messageBus } from '../message-bus/MessageBus';

export interface NavigationResolverProps {
  path: string;
}

export const NavigationResolver = ({ path }: NavigationResolverProps) => {
  if (path === '/') return <ProjectNavigation />;
  else if (/\/edit\/[^/]+$/.test(path)) return <EditNavigation />;
  return <></>;
};

const ProjectNavigation = () => {
  const navigate = useNavigate();

  const createProject = () => {
    try {
      const id = projectManager.createProject('Untitled');
      messageBus.push({ type: 'success', body: 'A new project has been created successfully' });
      navigate(`/edit/${id}`);
    } catch (err) {
      messageBus.push({ type: 'error', body: 'Failed to create a new project' });
    }
  };

  return (
    <Navigation
      title={'Projects'}
      left={[]}
      right={[
        {
          icon: Plus,
          text: 'New project',
          onClick: () => createProject()
        }
      ]}
    />
  );
};

const EditNavigation = () => {
  const navigate = useNavigate();

  return (
    <Navigation
      title={'My first circuit'}
      left={[{ icon: Home, onClick: () => navigate('/') }]}
      right={[
        {
          icon: Plus,
          text: 'Create gate',
          onClick: () => console.log('create gate clicked')
        },
        {
          icon: GitMerge,
          onClick: () => console.log('cleanup clicked')
        }
      ]}
    />
  );
};

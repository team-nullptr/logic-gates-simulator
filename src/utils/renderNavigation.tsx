import { GitMerge, Home, Plus, ArrowLeft } from 'react-feather';
import { Navigation } from '../features/navigation/Navigation';
import { useNavigate } from 'react-router-dom';

export const renderNavigation = (path: string) => {
  switch (path) {
    case '/':
      return <ProjectNavigation />;
    case '/edit':
      return <EditNavigation />;
    case '/create':
      return <ProjectCreateNavigation />;
  }
};

const ProjectCreateNavigation = () => {
  const navigate = useNavigate();

  return (
    <Navigation
      title="Create a project"
      left={[
        {
          icon: ArrowLeft,
          text: 'Back',
          onClick: () => navigate('/')
        }
      ]}
      right={[]}
    />
  );
};

const ProjectNavigation = () => {
  const navigate = useNavigate();

  return (
    <Navigation
      title={'Projects'}
      left={[]}
      right={[
        {
          icon: Plus,
          text: 'New project',
          onClick: () => navigate('/create')
        }
      ]}
    />
  );
};

const EditNavigation = () => (
  <Navigation
    title={'My first circuit'}
    left={[{ icon: Home, onClick: () => console.log('home clicked') }]}
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

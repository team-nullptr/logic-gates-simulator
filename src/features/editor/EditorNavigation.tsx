import { useNavigate } from 'react-router-dom';
import { Navigation } from '../navigation/Navigation';
import { GitMerge, Home, Plus } from 'react-feather';

interface EditorNavigationProps {
  title: string;
}

export const EditorNavigation = ({ title }: EditorNavigationProps) => {
  const navigate = useNavigate();

  return (
    <Navigation
      title={title}
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

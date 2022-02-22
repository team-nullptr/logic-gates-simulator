import { useNavigate } from 'react-router-dom';
import { Navigation } from '../navigation/Navigation';
import { GitMerge, Home, Plus } from 'react-feather';

interface EditorNavigationProps {
  title: string;
  onCreateGate: () => void;
}

export const EditorNavigation = ({ title, onCreateGate }: EditorNavigationProps) => {
  const navigate = useNavigate();

  return (
    <Navigation
      title={title}
      left={[{ icon: Home, onClick: () => navigate('/') }]}
      right={[
        {
          icon: Plus,
          text: 'Create gate',
          onClick: onCreateGate
        },
        {
          icon: GitMerge,
          onClick: () => console.log('cleanup clicked')
        }
      ]}
    />
  );
};

import { useNavigate } from 'react-router-dom';
import { Navigation } from '../navigation/Navigation';
import { GitMerge, Home, Plus } from 'react-feather';
import { Editable } from '../common/Editable';

interface EditorNavigationProps {
  title: string;
  onRename: (to: string) => void;
  onCleanup: () => void;
  onCreateGate: () => void;
}

export const EditorNavigation = (props: EditorNavigationProps) => {
  const navigate = useNavigate();

  return (
    <Navigation
      left={[{ icon: Home, onClick: () => navigate('/') }]}
      right={[
        {
          icon: Plus,
          text: 'Create gate',
          onClick: props.onCreateGate
        },
        {
          icon: GitMerge,
          onClick: props.onCleanup
        }
      ]}
    >
      <Editable value={props.title} onEdit={props.onRename} />
    </Navigation>
  );
};

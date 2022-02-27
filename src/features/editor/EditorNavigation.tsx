import { useNavigate } from 'react-router-dom';
import { Navigation } from '../navigation/Navigation';
import { Eye, EyeOff, GitMerge, Home, Plus } from 'react-feather';
import { Editable } from '../common/Editable';

interface EditorNavigationProps {
  title: string;
  labels: boolean;
  onRename: (to: string) => void;
  onCreateGate: () => void;
  onLabelToggle: () => void;
  onCleanup: () => void;
}

export const EditorNavigation = (props: EditorNavigationProps) => {
  const navigate = useNavigate();

  return (
    <Navigation
      left={[{ icon: Home, onClick: () => navigate('/') }]}
      right={[
        { icon: Plus, text: 'Create gate', onClick: props.onCreateGate },
        { icon: props.labels ? EyeOff : Eye, onClick: props.onLabelToggle },
        { icon: GitMerge, onClick: props.onCleanup }
      ]}
    >
      <Editable value={props.title} onEdit={props.onRename} />
    </Navigation>
  );
};

import { Navigation } from '../navigation/Navigation';
import { ArrowLeft, GitMerge, X } from 'react-feather';
import { Editable } from '../common/Editable';

interface GateEditorNavigationProps {
  onBack: () => void;
  onCancel: () => void;
  title: string;
  gateName: string;
  onRename: (to: string) => void;
  onCleanup: () => void;
}

export const GateEditorNavigation = (props: GateEditorNavigationProps) => {
  return (
    <Navigation
      color="hsl(265.9,88%,90%)"
      left={[
        { icon: ArrowLeft, onClick: props.onBack },
        { icon: X, onClick: props.onCancel }
      ]}
      right={[{ icon: GitMerge, onClick: props.onCleanup }]}
    >
      <Editable
        value={props.gateName}
        onEdit={props.onRename}
        prefix={props.title + ' / '}
        prefixColor="rgb(102,1,235)"
      />
    </Navigation>
  );
};

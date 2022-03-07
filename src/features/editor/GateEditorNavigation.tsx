import { Navigation } from '../navigation/Navigation';
import { ArrowLeft, Check, Eye, EyeOff, GitMerge } from 'react-feather';
import { Editable } from '../common/Editable';

interface GateEditorNavigationProps {
  onBack: () => void;
  onCancel: () => void;
  title: string;
  gateName: string;
  labels: boolean;
  onRename: (to: string) => void;
  onLabelToggle: () => void;
  onCleanup: () => void;
}

export const GateEditorNavigation = (props: GateEditorNavigationProps) => {
  return (
    <Navigation
      color="hsl(265.9,88%,95%)"
      left={[
        { icon: ArrowLeft, tooltip: 'Cancel', onClick: props.onCancel },
        { icon: Check, tooltip: 'Save', onClick: props.onBack }
      ]}
      right={[
        { icon: props.labels ? EyeOff : Eye, tooltip: 'Toggle labels', onClick: props.onLabelToggle },
        { icon: GitMerge, tooltip: 'Cleanup', onClick: props.onCleanup }
      ]}
    >
      <Editable
        value={props.gateName}
        onEdit={props.onRename}
        prefix={props.title + ' / '}
        prefixColor="hsl(266,99%,36%)"
        maxLength={8}
      />
    </Navigation>
  );
};

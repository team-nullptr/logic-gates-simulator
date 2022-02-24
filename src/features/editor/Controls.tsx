import { useRef } from 'react';
import { Button as ButtonType } from '../canvas/types/Button';
import { Button } from './Button';
import { BinaryButton } from './BinaryButton';
import styles from './Controls.module.scss';
import { AddButton } from './AddButton';

export const Controls = (props: {
  buttons: ButtonType[];
  section: 'inputs' | 'outputs';
  onScroll: (top: number) => void;
  onAdd: (connectors: number) => void;
  onDelete: (id: string) => void;
  onToggle: (button: ButtonType, index: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const direction = props.section === 'inputs' ? 'rtl' : 'ltr';

  const renderButton = (button: ButtonType) => {
    if (button.type === 'compound') {
      return (
        <BinaryButton
          state={button.state}
          onChange={(index) => props.onToggle(button, index)}
          onDelete={() => props.onDelete(button.id)}
          key={button.id}
          locked={props.section === 'outputs'}
        />
      );
    }

    return (
      <Button
        color="#6601EB"
        active={button.state[0]}
        onClick={() => props.onToggle(button, 0)}
        onDelete={() => props.onDelete(button.id)}
        key={button.id}
        locked={props.section === 'outputs'}
      >
        {button.slug}
      </Button>
    );
  };

  const handleScroll = () => {
    if (!ref.current) return;
    props.onScroll(ref.current.scrollTop);
  };

  return (
    <div ref={ref} onScroll={handleScroll} className={styles.buttons} style={{ direction }}>
      {props.buttons.map(renderButton)}
      <AddButton onSelect={props.onAdd} />
    </div>
  );
};

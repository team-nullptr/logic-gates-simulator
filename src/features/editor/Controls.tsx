import { useRef } from 'react';
import { Button as ButtonType } from '../canvas/types/Button';
import { BinaryButton } from './BinaryButton';
import styles from './Controls.module.scss';
import { AddButton } from './AddButton';
import { StyledButton } from './Button.styles';
import { ColorScheme } from './types/ColorScheme';
import { useColorVariant } from './hooks/useColorVariant';
import { Port } from './Port';

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
        <Port key={button.id} onDelete={() => props.onDelete(button.id)}>
          <BinaryButton
            state={button.state}
            onChange={(index) => props.onToggle(button, index)}
            locked={props.section === 'outputs'}
          />
        </Port>
      );
    }

    const scheme: ColorScheme = ['hsl(266,99%,46%)', 'hsl(266 88% 65%)', 'hsl(266 88% 82%)', 'hsl(266 88% 90%)'];
    const [background, hover, color] = useColorVariant(scheme, button.state[0]);

    const locked = props.section === 'outputs';

    return (
      <Port key={button.id} onDelete={() => props.onDelete(button.id)}>
        <StyledButton
          background={background}
          hover={locked ? background : hover}
          onClick={() => props.onToggle(button, 0)}
          style={{ cursor: locked ? 'not-allowed' : 'default' }}
        >
          <span style={{ color }}>{button.slug}</span>
        </StyledButton>
      </Port>
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

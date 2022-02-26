import { useRef, useState } from 'react';
import { Button as ButtonType } from '../canvas/types/Button';
import { BinaryButton } from './BinaryButton';
import styles from './Controls.module.scss';
import { AddButton } from './AddButton';
import { StyledButton } from './Button.styles';
import { useColorVariant } from './hooks/useColorVariant';
import { Port } from './Port';
import { Edit3 } from 'react-feather';
import { Editable } from '../common/Editable';
import { Adapter } from './Adapter';
import { Scheme } from '../../common/Scheme';

export const Controls = (props: {
  section: 'inputs' | 'outputs';
  source: Adapter;
  onScroll: (top: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const scheme = Scheme[editing ? 'black' : 'purple'];
  const direction = props.section === 'inputs' ? 'rtl' : 'ltr';

  const renderButton = (button: ButtonType, key: number) => {
    const locked = props.section === 'outputs';

    if (button.type === 'compound') {
      return (
        <Port key={button.id} onDelete={() => handleDelete(button)}>
          <BinaryButton state={button.state} onChange={(index) => handleToggle(button, index)} locked={locked} />
        </Port>
      );
    }

    const renderButtonContent = () => {
      const slug = button.slug || '';

      if (!editing) return <span>{slug}</span>;
      return <Editable key={slug} maxLength={3} value={slug} onEdit={(to) => handleRename(button, to)} />;
    };

    const [background, hover, color] = useColorVariant(scheme, editing ? false : button.state[0]);

    return (
      <Port key={key} onDelete={() => handleDelete(button)}>
        <StyledButton
          background={background}
          hover={locked ? background : hover}
          onClick={() => handleToggle(button, 0)}
          style={{ color, cursor: locked && !editing ? 'not-allowed' : 'default' }}
        >
          {renderButtonContent()}
        </StyledButton>
      </Port>
    );
  };

  const renderEdit = () => {
    const [background, hover, color] = useColorVariant(Scheme.black, editing);
    return (
      <StyledButton background={background} hover={hover} onClick={() => setEditing(!editing)}>
        <Edit3 height="20" color={color} />
      </StyledButton>
    );
  };

  const handleScroll = () => {
    if (!ref.current) return;
    props.onScroll(ref.current.scrollTop);
  };

  const handleAdd = (connectors: number) => {
    const type = props.section === 'inputs' ? 'input' : 'output';
    props.source.addPort(type, connectors);
  };

  const handleToggle = (button: ButtonType, index = 0) => {
    if (editing) return;
    props.source.toggleInput(button.id, index);
  };

  const handleRename = (button: ButtonType, name: string) => {
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 3) return;
    props.source.renamePort(button.id, trimmed.toUpperCase());
  };

  const handleDelete = (button: ButtonType) => {
    props.source.removePort(button.id);
  };

  return (
    <div ref={ref} onScroll={handleScroll} className={styles.buttons} style={{ direction }}>
      {renderEdit()}
      {props.source[props.section].map((it, i) => renderButton(it, i))}
      <AddButton onSelect={handleAdd} />
    </div>
  );
};

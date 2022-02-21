import { useRef } from 'react';
import { Button as ButtonType } from '../canvas/types/Button';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Plus } from 'react-feather';
import styles from './Controls.module.scss';
import { AddButton } from './AddButton';

export const Controls = (props: {
  buttons: ButtonType[];
  section: 'inputs' | 'outputs';
  onScroll: (top: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const direction = props.section === 'inputs' ? 'rtl' : 'ltr';

  const renderButton = (button: ButtonType) => {
    if (button.type === 'compound') {
      return <ButtonGroup button={button} onChange={console.log} key={button.id} />;
    }

    return (
      <Button color="#6601EB" active={button.state[0]} onClick={console.log} key={button.id}>
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
      <AddButton />
    </div>
  );
};

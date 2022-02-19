import { useRef } from 'react';
import { Button as ButtonType } from '../canvas/types/Button';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Plus } from 'react-feather';
import styles from './Controls.module.scss';

export const Controls = (props: {
  buttons: ButtonType[];
  section: 'inputs' | 'outputs';
  onScroll: (top: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const direction = props.section === 'inputs' ? 'rtl' : 'ltr';

  const renderButton = (button: ButtonType) => {
    if (button.type === 'compound') {
      return <ButtonGroup button={button} onChange={console.log} key={button.id}/>;
    }

    return (
      <Button color="hsl(266deg 99% 64%)" active={button.state[0]} onClick={console.log} key={button.id}>
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
      <Button color="hsl(136deg 100% 59%)" active={false} onClick={console.log}>
        <Plus width={20}/>
      </Button>
    </div>
  );
};

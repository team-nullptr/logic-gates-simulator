import styles from './Controls.module.scss';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Plus } from 'react-feather';
import { MutableRefObject } from 'react';
import { Button as ButtonType } from '../canvas/types/Button';

export const Controls = (props: {
  buttons: ButtonType[];
  section: 'inputs' | 'outputs';
  scroll: MutableRefObject<number>;
}) => {
  return (
    <div
      style={{ direction: props.section === 'inputs' ? 'rtl' : 'ltr' }}
      className={styles.container}
      onScroll={(e) => (props.scroll.current = e.currentTarget.scrollTop)}
    >
      {props.buttons.map((button) => {
        if (button.type === 'single') {
          return (
            <Button
              color="hsl(266deg 99% 64%)"
              active={button.state[0]}
              onClick={(v) => console.log('new state', v)}
              key={button.id}
            >
              {button.slug}
            </Button>
          );
        }

        return <ButtonGroup button={button} onChange={(v) => console.log('new state', v)} key={button.id} />;
      })}
      <Button color="hsl(136deg 100% 59%)" active={false} onClick={(v) => console.log('new state', v)}>
        <Plus width={20} />
      </Button>
    </div>
  );
};

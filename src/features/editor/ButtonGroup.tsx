import styles from './ButtonGroup.module.scss';
import { Button } from './Button';
import { Button as ButtonType } from '../canvas/types/Button';

export const ButtonGroup = (props: { button: ButtonType; onChange: (state: boolean[]) => void }) => {
  const handleClick = (position: number) => {
    const copy = props.button.state.slice();
    copy[position] = !copy[position];
    props.onChange(copy);
  };

  const binary = props.button.state.slice().reverse();
  const mapped = binary.map((it) => (it ? 1 : 0));
  const value = parseInt(mapped.join(''), 2);

  return (
    <div className={styles.container}>
      <p className={styles.value}>{value}</p>
      <div className={styles.wrapper}>
        {props.button.state.map((state, i) => (
          <Button color="#6601EB" active={state} onClick={() => handleClick(i)} key={i}>
            {i.toString()}
          </Button>
        ))}
      </div>
    </div>
  );
};

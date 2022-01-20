import styles from "./ButtonGroup.module.scss";
import { CompoundButton } from "./types/CompoundButton";
import { Button } from "./Button";
import { toBinaryArray } from "./utils/binary";

export const ButtonGroup = (props: {
  button: CompoundButton;
  onChange: (value: number) => void;
}) => {
  const states = toBinaryArray(props.button.value, props.button.length);

  const handleClick = (position: number) => {
    const copy = states.slice();
    copy[position] = !copy[position];

    const value = copy
      .reverse()
      .map((it) => (it ? 1 : 0))
      .join("");

    props.onChange(parseInt(value, 2));
  };

  return (
    <div className={styles.container}>
      <p className={styles.value}>{props.button.value}</p>
      <div className={styles.wrapper}>
        {states.map((state, i) => (
          <Button
            color="hsl(266deg 99% 64%)"
            active={state}
            onClick={() => handleClick(i)}
            key={i}
          >
            {i.toString()}
          </Button>
        ))}
      </div>
    </div>
  );
};

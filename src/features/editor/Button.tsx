import styles from "./Button.module.scss";

export const Button = (props: {
  letter: string;
  state: boolean;
  onClick: (value: boolean) => void;
}) => {
  return (
    <button
      data-active={props.state}
      className={styles.button}
      onClick={() => props.onClick(!props.state)}
    >
      {props.letter}
    </button>
  );
};

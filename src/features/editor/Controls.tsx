import styles from "./Controls.module.scss";
import { CompoundButton } from "./types/CompoundButton";
import { SingleButton } from "./types/SingleButton";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

type ButtonsType = (CompoundButton | SingleButton)[];

export const Controls = (props: {
  buttons: ButtonsType;
  section: "inputs" | "outputs";
}) => {
  return (
    <div
      style={{ direction: props.section === "inputs" ? "rtl" : "ltr" }}
      className={styles.container}
    >
      {props.buttons.map((button) => {
        if (button.type === "single") {
          return (
            <Button
              letter={button.letter}
              state={button.value}
              onClick={(v) => console.log("new state", v)}
              key={button.id}
            />
          );
        }

        return (
          <ButtonGroup
            button={button}
            onChange={(v) => console.log("new state", v)}
            key={button.id}
          />
        );
      })}
    </div>
  );
};

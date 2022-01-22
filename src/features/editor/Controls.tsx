import styles from "./Controls.module.scss";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";
import { Plus } from "react-feather";
import { FrameButton } from "./types/FrameButton";

export const Controls = (props: {
  buttons: FrameButton[];
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
              color="hsl(266deg 99% 64%)"
              active={button.value}
              onClick={(v) => console.log("new state", v)}
              key={button.id}
            >
              {button.letter}
            </Button>
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
      <Button
        color="hsl(136deg 100% 59%)"
        active={false}
        onClick={(v) => console.log("new state", v)}
      >
        <Plus width={20} />
      </Button>
    </div>
  );
};

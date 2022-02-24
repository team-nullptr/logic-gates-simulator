import { StyledSwitch, StyledDot } from './Switch.styles';

export const Switch = (props: { state: boolean; onChange: (state: boolean) => void }) => {
  return (
    <StyledSwitch onClick={() => props.onChange(!props.state)}>
      <StyledDot state={props.state} />
    </StyledSwitch>
  );
};

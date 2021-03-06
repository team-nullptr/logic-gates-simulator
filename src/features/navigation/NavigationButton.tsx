import { FC } from 'react';
import { Icon } from 'react-feather';
import { StyledButton } from './NavigationButton.styles';

export const NavigationButton: FC<{
  icon: Icon;
  text?: string;
  tooltip?: string;
  onClick: () => void;
}> = (props) => (
  <StyledButton onClick={props.onClick} expanded={!!props.text} title={props.tooltip}>
    <props.icon style={{ width: '18px', height: '18px', display: 'block' }} />
    {props.text && <span>{props.text}</span>}
  </StyledButton>
);

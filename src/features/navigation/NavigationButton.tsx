import { FC } from 'react';
import { Icon } from 'react-feather';
import { StyledButton } from './NavigationButton.styles';

export const NavigationButton: FC<{
  icon: Icon;
  text?: string;
  onClick: () => void;
}> = (props) => (
  <StyledButton onClick={props.onClick} expanded={!!props.text}>
    <props.icon style={{ width: '18px', height: '18px', display: 'block', minWidth: 'fit-content' }} />
    {props.text && <span>{props.text}</span>}
  </StyledButton>
);

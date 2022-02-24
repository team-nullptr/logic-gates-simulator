import styled from 'styled-components';
import { FC, MouseEvent } from 'react';
import { useColor } from './hooks/useColor';
import { useColorVariant } from './hooks/useColorVariant';
import { isDeleteChord } from '../../common/utils';

interface StyledButtonProps {
  text: string;
  primary: string;
  primaryVariant: string;
  locked: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 5px;
  font: inherit;
  font-weight: bold;
  flex: none;
  margin: 8px 8px 0;
  outline: none;
  color: ${(props) => props.text};
  background: ${(props) => props.primary};
  cursor: ${(props) => (props.locked ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${(props) => props.primaryVariant};
  }
`;

export const Button: FC<{
  color: string;
  active: boolean;
  onClick: () => void;
  onDelete?: () => void;
  locked?: boolean;
}> = (props) => {
  const scheme = useColor(props.color);
  const [primary, variant, text] = useColorVariant(scheme, props.active);

  const clickHandler = (event: MouseEvent) => {
    if (isDeleteChord(event)) {
      props.onDelete?.();
    } else if (!props.locked) {
      props.onClick();
    }
  };

  return (
    <StyledButton
      text={text}
      primary={primary}
      primaryVariant={variant}
      onMouseDown={clickHandler}
      locked={!!props.locked}
    >
      {props.children}
    </StyledButton>
  );
};

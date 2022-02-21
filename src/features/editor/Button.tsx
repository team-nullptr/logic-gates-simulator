import styled from 'styled-components';
import { FC } from 'react';
import { useColor } from './hooks/useColor';
import { useColorVariant } from './hooks/useColorVariant';

interface StyledButtonProps {
  text: string;
  primary: string;
  primaryVariant: string;
}

export const StyledButton = styled.button<StyledButtonProps>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 5px;
  font: inherit;
  font-weight: bold;
  cursor: pointer;
  flex: none;
  margin: 8px 8px 0;
  outline: none;
  color: ${(props) => props.text};
  background: ${(props) => props.primary};

  &:hover {
    background: ${(props) => props.primaryVariant};
  }
`;

export const Button: FC<{
  color: string;
  active: boolean;
  onClick: () => void;
}> = (props) => {
  const scheme = useColor(props.color);
  const [primary, variant, text] = useColorVariant(scheme, props.active);

  return (
    <StyledButton text={text} primary={primary} primaryVariant={variant} onClick={() => props.onClick()}>
      {props.children}
    </StyledButton>
  );
};

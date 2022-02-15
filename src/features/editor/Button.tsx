import styled from 'styled-components';
import Color from 'color';
import { FC } from 'react';

interface StyledButtonProps {
  text: string;
  primary: string;
  primaryVariant: string;
}

const StyledButton = styled.button<StyledButtonProps>`
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
  onClick: (value: boolean) => void;
}> = (props) => {
  const color = Color(props.color);
  const desaturated = color.saturationl(64);

  const primary = color.toString();
  const text = desaturated.lightness(21).toString();
  const activeVariant = desaturated.lightness(54).toString();
  const inactiveVariant = desaturated.lightness(31).toString();

  const renderActiveButton = () => {
    return (
      <StyledButton text={text} primary={primary} primaryVariant={activeVariant}>
        {props.children}
      </StyledButton>
    );
  };

  const renderInactiveButton = () => {
    return (
      <StyledButton text={primary} primary={text} primaryVariant={inactiveVariant}>
        {props.children}
      </StyledButton>
    );
  };

  if (props.active) {
    return renderActiveButton();
  } else {
    return renderInactiveButton();
  }
};

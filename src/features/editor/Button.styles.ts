import styled from 'styled-components';

interface StyledButtonProps {
  background: string;
  hover: string;
}

export const StyledButton = styled.button<StyledButtonProps>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 5px;
  font: inherit;
  font-weight: bold;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 8px 0;
  outline: none;
  background: ${(props) => props.background};

  &:hover {
    background: ${(props) => props.hover};
  }
`;

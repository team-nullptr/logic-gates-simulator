import styled from 'styled-components';

interface StyledButtonProps {
  expanded: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  background: ${({ expanded }) => (expanded ? '#e1d1fc' : 'transparent')};
  border: 0;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  font-weight: 500;
  color: ${({ expanded }) => (expanded ? '#6601eb' : '#000')};

  &:hover {
    background: ${({ expanded }) => (expanded ? '#d7c9f2' : 'rgba(0, 0, 0, 0.08)')};
  }
`;

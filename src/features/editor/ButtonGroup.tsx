import styled from 'styled-components';
import { StyledButton } from './Button.styles';

export const ButtonGroup = styled.div<{ color: string; horizontal?: boolean }>`
  background-color: ${(props) => props.color};
  margin: 8px 4px 0;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  flex-direction: ${(props) => (props.horizontal ? 'row' : 'column')};

  ${StyledButton} {
    margin: 0;
  }
`;

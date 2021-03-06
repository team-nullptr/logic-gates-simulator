import styled from 'styled-components';

export const StyledInput = styled.input`
  font: inherit;
  outline: none;
  border: none;
  background: none;
  text-align: inherit;
  padding: 6px 0 4px;
  width: 100%;
  max-width: 300px;
  color: inherit;

  &:focus {
    border-bottom: 2px solid #e1d1fc;
  }
`;

export const StyledSpan = styled.span`
  white-space: nowrap;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 6px 0;
  min-width: 24px;
  cursor: pointer;
`;

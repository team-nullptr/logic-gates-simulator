import styled from 'styled-components';

export const StyledButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 8px;
  scrollbar-color: #aaa white;

  > * {
    direction: initial;
  }
`;

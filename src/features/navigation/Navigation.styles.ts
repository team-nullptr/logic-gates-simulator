import styled from 'styled-components';

export const StyledNavigation = styled.nav`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 11px;
  text-align: center;
  font-weight: 500;
`;

export const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
`;

export const StyledActionGroup = styled(StyledContainer)<{ side: 'left' | 'right' }>`
  justify-content: ${(props) => (props.side === 'left' ? 'flex-start' : 'flex-end')};
  gap: 8px;
`;

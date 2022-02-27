import styled from 'styled-components';

export const StyledMain = styled.main`
  height: calc(100% - 50px);
  display: flex;
`;

export const StyledWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

export const StyledSide = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

export const StyledCanvas = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  width: 100%;
`;

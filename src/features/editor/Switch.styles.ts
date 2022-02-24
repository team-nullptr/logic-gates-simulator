import styled from 'styled-components';

export const StyledSwitch = styled.div`
  width: 100%;
  height: 16px;
  position: relative;
  background: hsl(265deg 88% 90%);
  border-radius: 16px;
`;

export const StyledDot = styled.div<{ state: boolean }>`
  position: absolute;
  top: 0;
  ${(props) => (props.state ? 'right' : 'left')}: 0;
  height: 100%;
  aspect-ratio: 1/1;
  background: rgb(102, 1, 235);
  border-radius: 100%;
`;

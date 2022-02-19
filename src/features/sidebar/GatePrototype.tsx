import styled from 'styled-components';

const StyledContainer = styled.div`
  background: #181818;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  position: relative;
  cursor: grab;
`;

const StyledContent = styled.p<{ color: string }>`
  position: relative;
  top: 50%;
  left: 12px;
  width: calc(100% - 24px);
  transform: translateY(-50%);
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: ${(props) => props.color};
    width: 24px;
    height: 3px;
    border-radius: 2px;
  }
`;

export const GatePrototype = (props: { text: string; color: string }) => {
  return (
    <StyledContainer>
      <StyledContent color={props.color}>{props.text}</StyledContent>
    </StyledContainer>
  );
};

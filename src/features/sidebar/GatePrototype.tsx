import styled from 'styled-components';
import { DragEvent, useRef } from 'react';
import { GateDataTransfer } from '../../common/GateDataTransfer';

const StyledContainer = styled.div`
  background: #fafafa;
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

export const GatePrototype = (props: { id: string; text: string; color: string }) => {
  const { id, text, color } = props;
  const ref = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const payload: GateDataTransfer = { id, offset: [offsetX, offsetY] };

    event.dataTransfer.setData('text/plain', text);
    event.dataTransfer.setData('gate/json', JSON.stringify(payload));
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <StyledContainer onDragStart={handleDragStart} ref={ref} draggable>
      <StyledContent color={color}>{text}</StyledContent>
    </StyledContainer>
  );
};

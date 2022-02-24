import styled from 'styled-components';
import { DragEvent, MouseEvent, useRef } from 'react';
import { GateDataTransfer } from '../../common/GateDataTransfer';
import { Prototype } from './types/Prototype';
import { isDeleteChord } from '../../common/utils';

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

export const GatePrototype = (props: { prototype: Prototype; onDelete: () => void }) => {
  const { type, name, color } = props.prototype;
  const ref = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const payload: GateDataTransfer = { type, offset: [offsetX, offsetY] };

    event.dataTransfer.setData('text/plain', name);
    event.dataTransfer.setData('gate/json', JSON.stringify(payload));
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (!isDeleteChord(event)) return;
    event.preventDefault();
    props.onDelete();
  };

  return (
    <StyledContainer onMouseDown={handleMouseDown} onDragStart={handleDragStart} ref={ref} draggable>
      <StyledContent color={color}>{name}</StyledContent>
    </StyledContainer>
  );
};

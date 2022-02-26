import { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { isDeleteChord } from '../../common/utils';
import { isPortDataTransfer, PortDataTransfer } from './types/PortDataTransfer';

export const Port: FC<{
  id: string;
  side: 'inputs' | 'outputs';
  onDelete: () => void;
  onDrop: (other: string) => void;
}> = (props) => {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragstart', handleDragStart);
      element.removeEventListener('dragend', handleDragEnd);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('drop', handleDrop);
    };
  });

  const handleDragStart = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    setDragging(true);

    const { id, side } = props;
    const payload: PortDataTransfer = { id, side };

    event.dataTransfer.setData('port/json', JSON.stringify(payload));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDragOver = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    if (!event.dataTransfer) return;

    const data = event.dataTransfer.getData('port/json');
    if (!data) return;

    const payload = JSON.parse(data);
    if (!payload || !isPortDataTransfer(payload)) return;

    const { id, side } = payload;
    if (side !== props.side) return;

    props.onDrop(id);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!isDeleteChord(event)) return;
    props.onDelete();
  };

  return (
    <div onMouseUp={handleMouseUp} style={{ opacity: dragging ? 0.5 : 1 }} ref={ref} draggable>
      {props.children}
    </div>
  );
};

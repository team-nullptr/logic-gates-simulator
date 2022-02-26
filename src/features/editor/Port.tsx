import { FC, MouseEvent } from 'react';
import { isDeleteChord } from '../../common/utils';

export const Port: FC<{ onDelete: () => void }> = (props) => {
  const handleMouseUp = (event: MouseEvent) => {
    if (!isDeleteChord(event)) return;
    props.onDelete();
  };

  return <div onMouseUp={handleMouseUp}>{props.children}</div>;
};

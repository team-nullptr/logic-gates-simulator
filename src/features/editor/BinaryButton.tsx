import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import styled from 'styled-components';
import { MouseEvent } from 'react';
import { isDeleteChord } from '../../common/utils';

export const BinaryButton = (props: {
  state: boolean[];
  onChange: (bit: number) => void;
  onDelete: () => void;
  locked?: boolean;
}) => {
  const binary = props.state.map((it) => (it ? 1 : 0));
  const value = parseInt(binary.join(''), 2);

  const handleMouseDown = (event: MouseEvent) => {
    if (!isDeleteChord(event)) return;
    event.preventDefault();
    props.onDelete();
  };

  return (
    <ButtonGroup color="hsl(265.9,88%,95%)" onMouseDown={handleMouseDown}>
      <StyledValue>{value}</StyledValue>
      {props.state.map((it, i) => (
        <Button key={i} color="rgb(102,1,235)" active={it} onClick={() => props.onChange(i)} locked={props.locked}>
          {props.state.length - i - 1}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const StyledValue = styled.p`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: rgb(102, 1, 235);
`;

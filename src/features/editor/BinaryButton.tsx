import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import styled from 'styled-components';
import { MouseEvent, useState } from 'react';
import { isDeleteChord } from '../../common/utils';
import { Switch } from './Switch';

export const BinaryButton = (props: {
  state: boolean[];
  onChange: (bit: number) => void;
  onDelete: () => void;
  locked?: boolean;
}) => {
  const [signed, setSigned] = useState(false);
  const value = parseBinary(props.state, signed);

  const handleMouseDown = (event: MouseEvent) => {
    if (!isDeleteChord(event)) return;
    event.preventDefault();
    props.onDelete();
  };

  return (
    <ButtonGroup color="hsl(265.9,88%,95%)" onMouseDown={handleMouseDown}>
      <StyledValue>{value}</StyledValue>
      <Switch state={signed} onChange={setSigned} />
      {props.state.map((it, i) => (
        <Button key={i} color="rgb(102,1,235)" active={it} onClick={() => props.onChange(i)} locked={props.locked}>
          {props.state.length - i - 1}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export const parseBinary = (value: boolean[], signed: boolean): number => {
  const binary = value.map((it) => (it ? 1 : 0));
  const number = parseInt(binary.join(''), 2);

  if (!signed || !value[0]) return number;
  return -(Math.pow(2, value.length) - number);
};

const StyledValue = styled.p`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: rgb(102, 1, 235);
  direction: ltr;
`;

import { ButtonGroup } from './ButtonGroup';
import styled from 'styled-components';
import { useState } from 'react';
import { Switch } from './Switch';
import { StyledButton } from './Button.styles';
import { useColorVariant } from './hooks/useColorVariant';
import { ColorScheme } from './types/ColorScheme';

export const BinaryButton = (props: { state: boolean[]; onChange: (bit: number) => void; locked?: boolean }) => {
  const [signed, setSigned] = useState(false);
  const value = parseBinary(props.state, signed);

  return (
    <ButtonGroup color="hsl(265.9,88%,95%)">
      <StyledValue>{value}</StyledValue>
      <Switch state={signed} onChange={setSigned} />
      {props.state.map((it, i) => {
        const scheme: ColorScheme = ['hsl(266,99%,46%)', 'hsl(266 88% 65%)', 'hsl(266 88% 82%)', 'hsl(266 88% 90%)'];
        const [background, hover, color] = useColorVariant(scheme, it);

        return (
          <StyledButton
            key={i}
            background={background}
            hover={props.locked ? background : hover}
            onClick={() => props.onChange(i)}
          >
            <span style={{ color }}>{props.state.length - i - 1}</span>
          </StyledButton>
        );
      })}
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

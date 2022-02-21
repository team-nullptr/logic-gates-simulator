import { Button, StyledButton } from './Button';
import { Plus } from 'react-feather';
import { ButtonGroup } from './ButtonGroup';
import styled from 'styled-components';

export const AddButton = (props: { onSelect: (option: number) => void }) => {
  const options = [1, 2, 4, 8];

  return (
    <StyledGroup color="hsl(47deg 90% 95%)">
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <Button color="#EBB90C" active={false} onClick={() => {}}>
        <Plus width={20} />
      </Button>
      {options.map((number) => (
        <Button key={number} color="#EBB90C" active={false} onClick={() => props.onSelect(number)}>
          {number}
        </Button>
      ))}
    </StyledGroup>
  );
};

const StyledGroup = styled(ButtonGroup)`
  margin-bottom: 192px;

  &:hover {
    margin-bottom: 0;
  }

  > ${StyledButton}:not(:first-child) {
    display: none;
  }

  &:hover > ${StyledButton} {
    display: block;
  }
`;

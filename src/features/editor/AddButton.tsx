import { ButtonGroup } from './ButtonGroup';
import styled from 'styled-components';
import { StyledButton } from './Button.styles';
import { Plus } from 'react-feather';

export const AddButton = (props: { onSelect: (option: number) => void }) => {
  const options = [1, 2, 4, 8];

  return (
    <StyledGroup color="hsl(47deg 90% 95%)">
      <StyledButton background="hsl(46 88% 90%)" hover="hsl(46 88% 82%)" onClick={() => props.onSelect(1)}>
        <Plus height="20" color="#ebb90c" />
      </StyledButton>
      {options.map((number) => (
        <StyledButton
          key={number}
          background="hsl(46 88% 90%)"
          hover="hsl(46 88% 82%)"
          onClick={() => props.onSelect(number)}
        >
          <span style={{ color: '#ebb90c' }}>{number}</span>
        </StyledButton>
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
    display: flex;
  }
`;

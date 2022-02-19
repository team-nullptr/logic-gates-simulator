import styled from 'styled-components';
import { Button as ButtonType } from '../canvas/types/Button';
import { useColor } from './hooks/useColor';
import { useColorVariant } from './hooks/useColorVariant';

export const Connectors = (props: { buttons: ButtonType[]; top: number }) => {
  const scheme = useColor('hsl(266deg 99% 64%)');

  const renderButton = (active: boolean, key: string | number) => {
    const [color] = useColorVariant(scheme, active);
    return <StyledConnector color={color} key={key} />;
  };

  return (
    <StyledContainer>
      <div style={{ transform: `translateY(${-props.top}px)` }}>
        {props.buttons.map((button) => {
          if (button.type === 'single') return renderButton(button.state[0], button.id);
          return <StyledConnectorGroup key={button.id}>{button.state.map(renderButton)}</StyledConnectorGroup>;
        })}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  overflow-y: hidden;
  padding-bottom: 96px;
  margin: 0 8px;
  height: 100%;
`;

const StyledConnector = styled.div<{ color: string }>`
  height: 48px;
  width: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 24px;
    left: 0;
    width: 8px;
    height: 8px;
    background: ${(props) => props.color};
    border-radius: 8px;
  }
`;

const StyledConnectorGroup = styled.div`
  padding: 52px 0 4px;
`;

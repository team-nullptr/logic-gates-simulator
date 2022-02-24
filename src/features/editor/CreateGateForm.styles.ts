import styled from 'styled-components';

export const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;

export const StyledPopup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: white;
  border-radius: 8px;
  padding: 20px;
`;

export const StyledInput = styled.input`
  padding: 8px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #aaa;
  font-size: 16px;
`;

interface StyledButtonProps {
  primary?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: ${({ primary }) => (primary ? '#e1d1fc' : '#fff')};
  color: #6601eb;
  cursor: pointer;
  font-size: 16px;

  ${({ primary }) => (primary ? '' : 'border: 1px solid #6601eb')}
`;

export const StyledRow = styled.div`
  display: flex;
  gap: 10px;
`;

interface StyledPickerWrapperProps {
  x: number;
  y: number;
}

export const StyledPickerWrapper = styled.div<StyledPickerWrapperProps>`
  position: absolute;
  top: ${({ y }) => `${y}px`};
  left: ${({ x }) => `${x}px`};
`;

interface StyledColorPreviewProps {
  color: string;
}

export const StyledColorPreview = styled.div<StyledColorPreviewProps>`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${({ color }) => color};
  border: 1px solid #000;
`;

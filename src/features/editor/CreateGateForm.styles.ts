import styled from 'styled-components';

export const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
  background: rgba(0, 0, 0, 0.3);
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
  font-weight: 500;
`;

export const StyledInput = styled.input`
  height: 100%;
  border: none;
  padding: 8px 0;
  border-bottom: 2px solid #e1d1fc;
  outline: none;
  font: inherit;

  &:focus {
    border-color: #6601eb;
  }
`;

export const StyledColorPreview = styled.div<{ color: string }>`
  width: 34px;
  height: 34px;
  border-radius: 100%;
  cursor: pointer;
  background: ${({ color }) => color};
  border: 2px solid #e1d1fc;
`;

//
//
//
//
//
//
//
//
//

interface StyledButtonProps {
  primary?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ primary }) => (primary ? '#e1d1fc' : '#fff')};
  color: #6601eb;
  cursor: pointer;
  font: inherit;
  font-weight: 500;
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

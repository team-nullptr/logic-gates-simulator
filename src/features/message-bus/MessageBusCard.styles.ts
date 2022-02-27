import styled from 'styled-components';

interface StyledCardProps {
  success: boolean;
}

export const StyledCard = styled.div<StyledCardProps>`
  display: flex;
  width: 256px;
  padding: 12px 8px;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  min-height: 48px;
  background: ${({ success }) => (success ? '#ece0fd' : '#fde9e9')};
  color: ${({ success }) => (success ? 'rgb(102 1 235)' : 'rgb(238 73 73)')};
`;

export const StyledIcon = styled.div`
  & svg {
    display: block;
  }
`;

export const StyledMessage = styled.p`
  word-break: break-word;
`;

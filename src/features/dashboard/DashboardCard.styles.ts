import styled from 'styled-components';

export const StyledCard = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid #fafafa;
  height: max-content;
`;

export const StyledHeader = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  cursor: pointer;
`;

export const StyledOptionBar = styled.div`
  padding: 8px;
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
`;

export const StyledDeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

export const StyledIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  background: #e1d1fc;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  padding: 12px 16px 16px;
  cursor: default;
`;

export const StyledDescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledDate = styled.span`
  color: rgb(136, 136, 136);
  font-weight: lighter;
  font-size: 0.8rem;
`;

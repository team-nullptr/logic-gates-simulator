import styled from 'styled-components';

export const StyledCard = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  aspect-ratio: 4 / 3;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid #fafafa;
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StyledHeader = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
  height: 0;
`;

export const StyledDescription = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  padding: 16px 12px;
  border-top: 2px solid #fafafa;
`;

export const StyledDescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledDate = styled.span`
  color: rgb(136, 136, 136);
  font-weight: lighter;
  font-size: 0.8rem;
`;

export const StyledDeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: #fff;
  border: 2px solid #f1f1f1;
  border-radius: 8px;
  cursor: pointer;
`;

export const StyledOptionBar = styled.div`
  padding: 8px;
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
`;

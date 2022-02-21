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
  flex-grow: 1;
  height: 0;
  object-fit: cover;
`;

export const StyledDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  padding: 16px 12px;
  border-top: 2px solid #fafafa;
`;

export const StyledTitle = styled.p`
  color: black;
  font-weight: bold;
  margin-bottom: 2px;
`;

export const StyledDate = styled.span`
  color: rgb(136, 136, 136);
  font-weight: lighter;
  font-size: 0.8rem;
`;

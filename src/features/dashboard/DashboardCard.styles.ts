import styled from 'styled-components';

export const StyledCard = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  aspect-ratio: 4 / 3;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgb(207, 207, 207);
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 75%;
  object-fit: cover;
`;

export const StyledDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 25%;
  padding: 0 10px;
  border-top: 1px solid rgb(207, 207, 207);
`;

export const StyledTitle = styled.p`
  color: black;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const StyledDate = styled.span`
  color: rgb(136, 136, 136);
  font-weight: lighter;
  font-size: 0.8rem;
`;

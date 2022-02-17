import styled from 'styled-components';

export const StyledWrapper = styled.main`
  padding: 50px;
  width: 100vw;
  max-width: 1600px;
  margin: 0 auto;
`;

export const StyledHeader = styled.header`
  margin: 0 0 20px 0;
`;

export const StyledGrid = styled.section`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, minmax(250px, 1fr));
`;

export const StyledTitle = styled.h1`
  font-size: 36px;
`;

import styled from 'styled-components';

export const StyledWrapper = styled.main`
  padding: 50px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

export const StyledHeader = styled.header`
  margin: 0 0 20px 0;
`;

export const StyledGrid = styled.section`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
`;

export const StyledTitle = styled.h1`
  font-size: 36px;
`;

export const StyledInfo = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
  color: #939393;
  margin: 96px 0;
`;

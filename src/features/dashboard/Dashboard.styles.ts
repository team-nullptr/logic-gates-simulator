import styled from 'styled-components';

export const StyledWrapper = styled.main`
  padding: 64px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
`;

export const StyledGrid = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
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

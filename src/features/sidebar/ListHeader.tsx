import { FC } from 'react';
import { StyledParagraph } from './List.styles';

export const ListHeader: FC<{ text: string }> = ({ text }) => <StyledParagraph>{text}</StyledParagraph>;

import { Message } from './MessageBus';
import { Check, X } from 'react-feather';
import { StyledCard, StyledIcon, StyledMessage } from './MessageBusCard.styles';

interface MessageBusCardProps {
  message: Message;
}

export const MessageBusCard = ({ message: { type, body } }: MessageBusCardProps) => (
  <StyledCard success={type === 'success'}>
    <StyledIcon>{type === 'success' ? <Check /> : <X />}</StyledIcon>
    <StyledMessage>{body}</StyledMessage>
  </StyledCard>
);

import styles from './MessageBusCard.module.scss';
import { Message, MessageType } from './MessageBus';
import { Check, AlertCircle } from 'react-feather';

interface MessageBusCardProps {
  message: Message;
}

const getBoxStyle = (type: MessageType) => {
  switch (type) {
    case 'success':
      return styles.card;
    case 'error':
      return styles.cardError;
  }
};

const getBoxIcon = (type: MessageType) => {
  switch (type) {
    case 'success':
      return <Check />;
    case 'error':
      return <AlertCircle />;
  }
};

export const MessageBusCard = ({ message: { type, body } }: MessageBusCardProps) => {
  return (
    <div className={getBoxStyle(type)}>
      <div>{getBoxIcon(type)}</div>
      <div>
        <p>{body}</p>
      </div>
    </div>
  );
};

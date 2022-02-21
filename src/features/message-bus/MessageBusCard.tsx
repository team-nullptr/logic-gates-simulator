import styles from './MessageBusCard.module.scss';
import { Message } from './MessageBus';
import { Check, X } from 'react-feather';

interface MessageBusCardProps {
  message: Message;
}

export const MessageBusCard = ({ message: { type, body } }: MessageBusCardProps) => {
  const classes = [styles.card, styles[type]];

  return (
    <div className={classes.join(' ')}>
      <div className={styles.icon}>{type === 'success' ? <Check /> : <X />}</div>
      <p className={styles.text}>{body}</p>
    </div>
  );
};

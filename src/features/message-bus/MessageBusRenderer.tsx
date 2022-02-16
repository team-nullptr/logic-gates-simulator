import styles from './MessageBusRenderer.module.scss';
import { useEffect, useState } from 'react';
import { messageBus } from './MessageBus';
import { Message } from './MessageBus';
import { MessageBusCard } from './MessageBusCard';

export const MessageBusRenderer = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const id = messageBus.subscribe((message) => {
      setMessages((messages) => [message, ...messages]);
      setTimeout(() => setMessages((messages) => messages.slice(0, -1)), 1000 * 8);
    });
    return () => messageBus.unsubscribe(id);
  }, []);

  return (
    <div className={styles.wrapper}>
      {messages.map((message) => (
        <MessageBusCard key={message.id} message={message} />
      ))}
    </div>
  );
};

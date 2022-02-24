import { useEffect, useState } from 'react';
import { messageBus } from './MessageBus';
import { Message } from './MessageBus';
import { MessageBusCard } from './MessageBusCard';
import { createPortal } from 'react-dom';

export const MessageBusRenderer = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const id = messageBus.subscribe((message) => {
      setMessages((messages) => [message, ...messages]);
      setTimeout(() => setMessages((messages) => messages.slice(0, -1)), 1000 * 8);
    });
    return () => messageBus.unsubscribe(id);
  }, []);

  return createPortal(
    <>
      {messages.map((message) => (
        <MessageBusCard key={message.id} message={message} />
      ))}
    </>,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector('#message-bus')!
  );
};

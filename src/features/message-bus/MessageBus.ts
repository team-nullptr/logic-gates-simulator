import { v4 as uuid } from 'uuid';

export type MessageType = 'success' | 'error';

export interface Message {
  id: string;
  type: MessageType;
  body: string;
}

type MessageBusSubscriber = (message: Message) => void;

class MessageBus {
  subscribers: Map<string, MessageBusSubscriber> = new Map<string, MessageBusSubscriber>();

  subscribe(subscriber: MessageBusSubscriber): string {
    const id = uuid();
    this.subscribers.set(id, subscriber);
    return id;
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  push(message: Pick<Message, 'type' | 'body'>) {
    this.subscribers.forEach((subscriber) => {
      subscriber({ id: uuid(), ...message });
    });
  }
}

export const messageBus = new MessageBus();

import { UserError } from '../../../core/simulator/elements/util/UserError';
import { messageBus } from '../../message-bus/MessageBus';

export const attempt = <T>(fn: () => T): [result: T | undefined, success: boolean] => {
  try {
    return [fn(), true];
  } catch (error) {
    if (error instanceof UserError) messageBus.push({ type: 'error', body: error.message });
    return [undefined, false];
  }
};

import { EventEmitter } from 'events';

export const Emitter = new EventEmitter();

export enum EmitterEvents {
  SEND_MESSAGE = 'sendMessage',
}

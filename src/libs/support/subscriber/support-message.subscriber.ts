import { Emitter, EmitterEvents } from 'src/common/emitter/emitter';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { SupportMessage } from '../model/support-message.model';

@EventSubscriber()
export class SupportMessageSubscriber
  implements EntitySubscriberInterface<SupportMessage>
{
  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<any>) {
    Emitter.emit(EmitterEvents.SEND_MESSAGE, event.entity);
  }
}

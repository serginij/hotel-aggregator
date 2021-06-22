import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { SupportRequest } from './support-request.model';

@Entity()
export class SupportMessage extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  author: string;

  @CreateDateColumn()
  sendAt: Date;

  @Column()
  text: string;

  @Column({ nullable: true })
  readAt: Date;

  @ManyToOne(() => SupportRequest, (supportRequest) => supportRequest.messages)
  supportRequest: SupportRequest;
}

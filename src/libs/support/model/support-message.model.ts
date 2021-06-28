import { ID } from 'src/common/common.types';
import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SupportMessage extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  author: ID;

  @CreateDateColumn()
  sentAt: Date;

  @Column()
  text: string;

  @Column({ nullable: true, default: null })
  readAt: Date;

  @Column()
  supportRequest: ID;
}

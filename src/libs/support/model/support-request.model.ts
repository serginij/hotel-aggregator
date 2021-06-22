import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { SupportMessage } from './support-message.model';

@Entity()
export class SupportRequest extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;

  @Column({ nullable: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => SupportMessage, (room) => room.supportRequest)
  messages: SupportMessage[];
}

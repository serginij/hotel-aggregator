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
  author: string;

  @CreateDateColumn()
  sentAt: Date;

  @Column()
  text: string;

  @Column({ nullable: true })
  readAt: Date;

  @Column()
  supportRequest: string;
}

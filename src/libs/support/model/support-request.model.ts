import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SupportRequest extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: string;

  @Column({ nullable: true, default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

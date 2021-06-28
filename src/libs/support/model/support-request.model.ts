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
export class SupportRequest extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: ID;

  @Column({ nullable: true, default: true })
  isActive?: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

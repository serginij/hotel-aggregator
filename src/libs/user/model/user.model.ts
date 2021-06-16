import { RoleEnum } from 'src/common/common.types';
import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ default: RoleEnum.CLIENT })
  role: RoleEnum;

  @Column({ nullable: true, default: null })
  contactPhone?: string;
}

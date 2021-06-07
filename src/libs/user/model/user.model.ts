import { RoleEnum } from 'src/common/common.types';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ default: RoleEnum.CLIENT })
  role: RoleEnum;

  @Column({ nullable: true })
  contactPhone: string;
}

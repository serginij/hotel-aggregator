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

  @Column({ default: 'client' })
  role: string;

  @Column({ nullable: true })
  contactPhone: boolean;
}

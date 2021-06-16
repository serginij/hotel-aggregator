import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { HotelRoom } from './hotel-room.model';

@Entity()
export class Hotel extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => HotelRoom, (room) => room.hotel)
  rooms: HotelRoom[];
}

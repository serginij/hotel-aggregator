import {
  Entity,
  Column,
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Hotel } from './hotel.model';

@Entity()
export class HotelRoom extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Hotel;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  isEnabled: boolean;
}

import { ID } from 'src/common/common.types';
import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Reservation extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  userId: ID;

  @Column()
  hotelId: ID;

  @Column()
  roomId: ID;

  @Column()
  dateStart: Date;

  @Column()
  dateEnd: Date;
}

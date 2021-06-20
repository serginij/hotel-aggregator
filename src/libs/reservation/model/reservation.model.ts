import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class Reservation extends BaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  // TODO: add link to models
  @Column()
  userId: string;

  @Column()
  hotelId: string;

  @Column()
  roomId: string;

  @Column()
  dateStart: Date;

  @Column()
  dateEnd: Date;
}

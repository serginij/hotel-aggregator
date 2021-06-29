import {
  EntityRepository,
  getMongoManager,
  ObjectID,
  Repository,
} from 'typeorm';

import { Reservation } from '../model/reservation.model';

import {
  CreateUserReservationData,
  SearchReservationParams,
} from '../interface/reservation.interface';
import { ID } from 'src/common/common.types';
import { ObjectId } from 'mongodb';
import { getIdMatch } from 'src/common/util/mongodb';

interface IReservationStore {
  createReservation(
    data: CreateUserReservationData,
  ): Promise<Reservation | undefined>;
  findById(id: ID): Promise<Reservation | undefined>;
  removeReservation(id: ID): Promise<void>;
  findAllReservations(
    filter: SearchReservationParams,
  ): Promise<Array<Reservation>>;
}

@EntityRepository(Reservation)
export class ReservationStore
  extends Repository<Reservation>
  implements IReservationStore
{
  createReservation = async (reservation: CreateUserReservationData) => {
    const { userId, hotelId, roomId, dateStart, dateEnd } = reservation;

    const res = Reservation.create({
      userId: ObjectId(userId),
      hotelId: ObjectId(hotelId),
      roomId: ObjectId(roomId),
      dateStart,
      dateEnd,
    });

    return await res.save();
  };

  findById = async (id: ID) => {
    return await Reservation.findOne(id);
  };

  findAllReservations = async (params: SearchReservationParams) => {
    const { userId, dateEnd, dateStart, hotelId, roomId } = params;

    const userIdMatch = getIdMatch(userId, 'userId');

    const dateEndMatch = dateEnd
      ? { dateEnd: { $lte: new Date(dateEnd) } }
      : {};

    const dateStartMatch = dateStart
      ? { dateStart: { $gte: new Date(dateStart) } }
      : {};

    const hotelIdMatch = getIdMatch(hotelId, 'hotelId');

    const roomIdMatch = getIdMatch(roomId, 'roomId');

    const res = getMongoManager().aggregate(Reservation, [
      {
        $match: {
          ...userIdMatch,
          ...dateStartMatch,
          ...dateEndMatch,
          ...hotelIdMatch,
          ...roomIdMatch,
        },
      },
      {
        $lookup: {
          from: 'hotel',
          localField: 'hotelId',
          foreignField: '_id',
          as: 'hotelField',
        },
      },
      {
        $lookup: {
          from: 'hotel_room',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },
      {
        $project: {
          id: 1,
          dateStart: 1,
          dateEnd: 1,
          hotelRoom: {
            title: {
              $arrayElemAt: ['$room.title', 0],
            },
            description: {
              $arrayElemAt: ['$room.description', 0],
            },
            images: {
              $arrayElemAt: ['$room.images', 0],
            },
          },
          hotel: {
            title: {
              $arrayElemAt: ['$hotelField.title', 0],
            },
            description: {
              $arrayElemAt: ['$hotelField.description', 0],
            },
          },
        },
      },
    ]);

    const data = await res.toArray();

    return data;
  };

  removeReservation = async (id: string) => {
    const reservationRoom = await Reservation.delete(id);

    return reservationRoom.raw;
  };
}

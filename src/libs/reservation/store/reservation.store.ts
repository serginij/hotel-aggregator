import { EntityRepository, Repository } from 'typeorm';

import { Reservation } from '../model/reservation.model';

import { SearchReservationParams } from '../interface/reservation.interface';
import { ReservationDto } from '../dto/reservation.dto';
import { ID } from 'src/common/common.types';

interface IReservationStore {
  createReservation(data: ReservationDto): Promise<Reservation | undefined>;
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
  createReservation = async (reservationDto: ReservationDto) => {
    const reservation = Reservation.create(reservationDto);

    return await reservation.save();
  };

  findById = async (id: ID) => {
    return await Reservation.findOne(id);
  };

  findAllReservations = async (params: SearchReservationParams) => {
    const { userId, dateEnd, dateStart, hotelId, roomId } = params;

    console.log(params);

    // TODO: check if it works
    return await Reservation.find({
      where: params,
    });
  };

  removeReservation = async (id: string) => {
    const reservationRoom = await Reservation.delete(id);

    return reservationRoom.raw;
  };
}

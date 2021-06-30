import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ID } from 'src/common/common.types';
import {
  CreateUserReservationData,
  SearchReservationParams,
  SearchUserReservationParams,
} from '../interface/reservation.interface';
import { Reservation } from '../model/reservation.model';
import { ReservationStore } from '../store/reservation.store';

interface IReservationService {
  create(data: CreateUserReservationData): Promise<Reservation | null>;
  deleteReservation(id: string, userId: string): Promise<Reservation | null>;
  deleteUserReservation(
    id: string,
    userId: string,
  ): Promise<Reservation | null>;
  findAllUserReservations(
    params: SearchUserReservationParams,
  ): Promise<Reservation[]>;
  findAllReservations(params: SearchReservationParams): Promise<Reservation[]>;
}

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectRepository(ReservationStore)
    private readonly reservationStore: ReservationStore,
  ) {}

  // Checks if reservation is empty
  private checkIfReservationEmpty = async (params: {
    hotelId: ID;
    roomId: ID;
    dateStart: Date;
    dateEnd: Date;
  }): Promise<boolean> => {
    const isExists = await this.reservationStore.findAllReservations(params);

    return isExists.length === 0;
  };

  // Create new reservation if reservation is empty
  create = async (reservation: CreateUserReservationData) => {
    const { hotelId, roomId, dateEnd, dateStart } = reservation;

    if (
      !(await this.checkIfReservationEmpty({
        hotelId,
        roomId,
        dateStart,
        dateEnd,
      }))
    )
      throw new BadRequestException('Reservation is already exists');

    const res = await this.reservationStore.createReservation(reservation);

    if (!res) return null;

    return res;
  };

  // Delete reservation based on userId
  deleteReservation = async (id: string, userId: ID) => {
    const reservation = await this.reservationStore.findById(id);

    if (reservation?.userId !== userId) throw new ForbiddenException();

    const res = await this.reservationStore.removeReservation(id);

    if (!res) return null;

    return res;
  };

  // Find add CLIENT reservations
  findAllUserReservations = async (params: SearchUserReservationParams) => {
    const reservations = await this.reservationStore.findAllReservations(
      params,
    );

    return reservations;
  };

  // Find all reservations
  findAllReservations = async (params: SearchReservationParams) => {
    const reservations = await this.reservationStore.findAllReservations(
      params,
    );

    return reservations;
  };

  // delete reservation based on userId
  deleteUserReservation = async (id: string, userId: ID) => {
    const reservation = await this.reservationStore.findById(id);

    if (reservation?.userId !== userId)
      throw new BadRequestException('Incorrect userId');

    const res = await this.reservationStore.removeReservation(id);

    if (!res) return null;

    return res;
  };
}

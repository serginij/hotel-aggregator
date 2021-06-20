import {
  BadRequestException,
  Delete,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Get,
  Query,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ID, RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HotelRoomService } from 'src/libs/hotel/core/hotel-room.service';
import { User } from 'src/libs/user/model/user.model';

import { ReservationService } from '../core/reservation.service';
import {
  ReservationDto,
  SearchUserReservationDto,
} from '../dto/reservation.dto';
import { SearchReservationParams } from '../interface/reservation.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Roles(RoleEnum.CLIENT)
  @Post()
  @UsePipes(new ValidationPipe())
  async createReservation(@Body() data: ReservationDto, @Param() user) {
    const room = await this.hotelRoomService.findById(data.roomId);

    if (!room) throw new BadRequestException('No room with given id');

    const userId = user.id;

    const reservation = await this.reservationService.create({
      ...data,
      userId,
    });

    if (!reservation)
      throw new InternalServerErrorException(
        'An error occured while creating reservation',
      );

    return reservation;
  }

  @Roles(RoleEnum.CLIENT)
  @Get()
  @UsePipes(new ValidationPipe())
  async getReservations(
    @Param() user,
    @Query() params: SearchUserReservationDto,
  ) {
    const userId = user.id;
    return await this.reservationService.findAllUserReservations({
      ...params,
      userId,
    });
  }

  @Roles(RoleEnum.CLIENT)
  @Delete('/:id')
  async updateReservations(@Param() id: string, @Param() user) {
    const userId = user.id;
    return await this.reservationService.deleteReservation(id, userId);
  }

  @Roles(RoleEnum.MANAGER)
  @Get('/:userId')
  async getUserReservations(@Param() userId: ID) {
    return await this.reservationService.findAllReservations({ userId });
  }

  @Roles(RoleEnum.MANAGER)
  @Delete('/:userId/:reservationId')
  async deleteUserReservation(@Param() userId: string, @Param() reservationId) {
    return await this.reservationService.deleteReservation(
      reservationId,
      userId,
    );
  }
}

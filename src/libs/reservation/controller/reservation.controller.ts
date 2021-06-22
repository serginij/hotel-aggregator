import {
  BadRequestException,
  Delete,
  Param,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Get,
  UsePipes,
} from '@nestjs/common';
import { ID, RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HotelRoomService } from 'src/libs/hotel/core/hotel-room.service';

import { ReservationService } from '../core/reservation.service';
import {
  ReservationDto,
  SearchUserReservationDto,
} from '../dto/reservation.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Roles(RoleEnum.CLIENT)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createReservation(@Body() data: ReservationDto, @Req() req) {
    const room = await this.hotelRoomService.findById(data.roomId);

    if (!room) throw new BadRequestException('No room with given id');

    const userId = req.user.id?.toString();

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
  // TODO: fix date transform
  @UsePipes(new ValidationPipe({ transform: true }))
  async getReservations(@Req() req, @Query() params: SearchUserReservationDto) {
    const userId = req.user.id;
    return await this.reservationService.findAllUserReservations({
      ...params,
      userId,
    });
  }

  @Roles(RoleEnum.CLIENT)
  @Delete('/:id')
  async updateReservations(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return await this.reservationService.deleteReservation(id, userId);
  }

  @Roles(RoleEnum.MANAGER)
  @Get('/:userId')
  async getUserReservations(@Param('userId') userId: ID) {
    return await this.reservationService.findAllReservations({ userId });
  }

  @Roles(RoleEnum.MANAGER)
  @Delete('/:userId/:reservationId')
  async deleteUserReservation(
    @Param('userId') userId: string,
    @Param('reservationId') reservationId,
  ) {
    return await this.reservationService.deleteReservation(
      reservationId,
      userId,
    );
  }
}

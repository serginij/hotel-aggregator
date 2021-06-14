import { Param, ValidationPipe } from '@nestjs/common';
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
import { RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { HotelRoomService } from '../core/hotel-room.service';
import { HotelRoomDto, UpdateHotelRoomDto } from '../dto/hotel-room.dto';
import { SearchHotelRoomParams } from '../interface/hotel-room.interface';

@Controller('hotel-rooms')
export class HotelRoomController {
  constructor(private readonly hotelRoomService: HotelRoomService) {}

  // TODO: add images processing
  @Roles(RoleEnum.ADMIN)
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createHotelRoom(@Body() data: HotelRoomDto) {
    const hotelRoom = await this.hotelRoomService.create(data);

    if (!hotelRoom)
      throw new InternalServerErrorException(
        'An error occured while creating hotelRoom',
      );

    return hotelRoom;
  }

  // TODO: add images processing
  @Roles(RoleEnum.ADMIN)
  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateHotelRooms(
    @Param() id: string,
    @Body() data: UpdateHotelRoomDto,
  ) {
    return await this.hotelRoomService.update(id, data);
  }

  @Get()
  async getHotelRooms(@Query() params: SearchHotelRoomParams) {
    return await this.hotelRoomService.findAll(params);
  }

  @Get('/:id')
  async getHotelRoomById(@Param() id: string) {
    return await this.hotelRoomService.findById(id);
  }
}

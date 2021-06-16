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

import { HotelService } from '../core/hotel.service';
import { HotelDto } from '../dto/hotel.dto';
import { SearchHotelParams } from '../interface/hotel.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Roles(RoleEnum.ADMIN)
  @Post()
  @UsePipes(new ValidationPipe())
  async createHotel(@Body() data: HotelDto) {
    const hotel = await this.hotelService.create(data);

    if (!hotel)
      throw new InternalServerErrorException(
        'An error occured while creating hotel',
      );

    return hotel;
  }

  @Roles(RoleEnum.ADMIN)
  @Get()
  @UsePipes(new ValidationPipe())
  async getHotels(@Query() params: SearchHotelParams) {
    return await this.hotelService.findAll(params);
  }

  @Roles(RoleEnum.ADMIN)
  @Put('/:id')
  @UsePipes(new ValidationPipe())
  async updateHotels(@Param() id: string, @Body() data: HotelDto) {
    return await this.hotelService.update(id, data);
  }
}

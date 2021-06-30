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
import { HotelDto, SearchHotelDto } from '../dto/hotel.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hotels')
@UsePipes(new ValidationPipe({ transform: true }))
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  // POST /api/v1/hotels
  @Roles(RoleEnum.ADMIN)
  @Post()
  async createHotel(@Body() data: HotelDto) {
    const hotel = await this.hotelService.create(data);

    if (!hotel)
      throw new InternalServerErrorException(
        'An error occured while creating hotel',
      );

    return hotel;
  }

  // GET /api/v1/hotels
  @Roles(RoleEnum.ADMIN)
  @Get()
  async getHotels(@Query() params: SearchHotelDto) {
    return await this.hotelService.findAll(params);
  }

  // PUT /api/v1/hotels/:id
  @Roles(RoleEnum.ADMIN)
  @Put('/:id')
  async updateHotels(@Param('id') id: string, @Body() data: HotelDto) {
    return await this.hotelService.update(id, data);
  }
}

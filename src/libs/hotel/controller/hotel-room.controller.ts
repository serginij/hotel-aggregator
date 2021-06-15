import {
  Param,
  UploadedFiles,
  UseInterceptors,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { imageFileFilter } from 'src/common/util/image-file-filter';

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
  @UseInterceptors(
    FilesInterceptor('files', 5, { fileFilter: imageFileFilter }),
  )
  // TODO: transform images into string array
  async createHotelRoom(
    @Body() data: HotelRoomDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log({ files });

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
  @UseInterceptors(
    FilesInterceptor('files', 5, { fileFilter: imageFileFilter }),
  )
  // TODO: merge images with files into string array
  async updateHotelRooms(
    @Param() id: string,
    @Body() data: UpdateHotelRoomDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log({ files });
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

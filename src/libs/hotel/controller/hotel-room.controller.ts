import {
  BadRequestException,
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
import { MAX_IMAGE_SIZE } from 'src/common/common.constants';
import { RoleEnum } from 'src/common/common.types';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  imageFileFilter,
  imageFileStorage,
} from 'src/common/util/image-file-filter';

import { HotelRoomService } from '../core/hotel-room.service';
import {
  HotelRoomDto,
  SearchHotelRoomDto,
  UpdateHotelRoomDto,
} from '../dto/hotel-room.dto';

const fileInterceptor = FilesInterceptor('files', 5, {
  fileFilter: imageFileFilter,
  storage: imageFileStorage,
  limits: { fileSize: MAX_IMAGE_SIZE },
});

@Controller('hotel-rooms')
export class HotelRoomController {
  constructor(private readonly hotelRoomService: HotelRoomService) {}

  private convertUploadedFiles = (files: Array<Express.Multer.File>) => {
    return files.map(({ filename }) => filename);
  };

  // POST ADMIN /api/v1/hotel-rooms
  @Roles(RoleEnum.ADMIN)
  @Post()
  @UseInterceptors(fileInterceptor)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createHotelRoom(
    @Body() data: HotelRoomDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (files.length < 1)
      throw new BadRequestException('Hotel room must have at least 1 image');

    const hotelRoom = await this.hotelRoomService.create({
      ...data,
      images: this.convertUploadedFiles(files),
    });

    if (!hotelRoom)
      throw new InternalServerErrorException(
        'An error occured while creating hotelRoom',
      );

    return hotelRoom;
  }

  // PUT ADMIN /api/v1/hotel-rooms/:id
  @Roles(RoleEnum.ADMIN)
  @Put('/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(fileInterceptor)
  async updateHotelRooms(
    @Param() id: string,
    @Body() data: UpdateHotelRoomDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const images = (data.images ?? []).concat(
      this.convertUploadedFiles(files ?? []),
    );

    return await this.hotelRoomService.update(id, { ...data, images });
  }

  // GET /api/v1/hotel-rooms
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getHotelRooms(@Query() params: SearchHotelRoomDto) {
    return await this.hotelRoomService.findAll(params);
  }

  // GET /api/v1/hotel-rooms/:id
  @Get('/:id')
  async getHotelRoomById(@Param('id') id: string) {
    return await this.hotelRoomService.findById(id);
  }
}

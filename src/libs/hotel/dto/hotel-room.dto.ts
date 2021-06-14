export class HotelRoomDto {
  readonly hotel: string;

  readonly title: string;

  readonly description?: string;

  readonly images: string[];
}

export class UpdateHotelRoomDto {
  readonly title?: string;

  readonly description?: string;

  readonly images: string[];
}

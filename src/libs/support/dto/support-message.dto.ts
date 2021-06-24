import { Transform, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ID } from 'src/common/common.types';

export class UserMarkMessagesAsReadDto {
  @IsString()
  supportRequest: ID;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  createdBefore: Date;
}

export class ManagerMarkMessagesAsReadDto {
  @IsString()
  user: ID;

  @IsString()
  supportRequest: ID;

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  createdBefore: Date;
}

export class GetUndsnreadCountDto {
  @IsString()
  supportRequest: ID;
}

export class GetManagerUnreadCountDto extends GetUndsnreadCountDto {
  @IsString()
  user: ID;
}

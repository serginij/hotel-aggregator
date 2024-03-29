import { Transform, Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ID } from 'src/common/common.types';

export class MarkMessagesAsReadDto {
  @IsString()
  @IsOptional()
  userId?: ID;

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

export class SendMessageDto {
  @IsString()
  text: string;
}

export class SubscribeToChatDto {
  @IsString()
  chatId: string;
}

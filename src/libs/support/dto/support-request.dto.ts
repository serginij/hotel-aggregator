import { IsString } from 'class-validator';

export class CreateSupportRequestDto {
  @IsString()
  text: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';

export class CreateGenre extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}

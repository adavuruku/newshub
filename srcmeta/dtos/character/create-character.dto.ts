import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../base.dto';

export class CreateCharacterDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  images: [string];
}

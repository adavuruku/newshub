import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { CreateArtistDto } from '../artist/create-artist.dto';
import { CreateAttributeDto } from '../attributes/create-attribute.dto';
import { BaseDto } from '../base.dto';
import { CreateBookDto } from './../books/create-book.dto';
export class CreateSceneDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  coverImage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsNotEmpty()
  explicitContent: boolean;

  @ApiProperty()
  attributes: [string];

  @ApiProperty()
  artists: [string];

  @ApiProperty()
  book: string;
}

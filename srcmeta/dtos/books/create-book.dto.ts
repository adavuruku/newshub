import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateAttributeDto } from '../attributes/create-attribute.dto';
import { BaseDto } from '../base.dto';
import { CreateGenre } from '../genre/createGenre';
import { CreateSaleOptionDto } from '../sale-option/create-sale-option.dto';
import { CreateSeriesDto } from '../series/create-series.dto';

export class CreateBookDto extends BaseDto {
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  infoLink: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberOfPages: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsNotEmpty()
  explicitContent: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  creator: string;

  @ApiProperty()
  series: [CreateSeriesDto];

  @ApiProperty()
  attributes: [CreateAttributeDto];

  @ApiProperty()
  genres: [CreateGenre];

  @ApiProperty({ type: [CreateSaleOptionDto] })
  saleOptions: [CreateSaleOptionDto];
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { BaseDto } from '../base.dto';

export enum SaleType {
  BUY = 'Buy',
  AUCTION = 'Aution',
  LAUNCH = 'Launch',
}

export class CreateSaleOptionDto extends BaseDto {
  @ApiProperty({
    enum: SaleType,
    default: SaleType.BUY,
  })
  type: SaleType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  loyaltyOnBookSale: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  loyaltySceneSale: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  copiesAvailable: number;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  duration: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BookQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  perPage?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  population?: string[];
  @ApiProperty({ required: false })
  @IsOptional()
  selection?: string[];
}

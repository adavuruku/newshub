import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AttributeType } from '../../main/attributes/entities/attribute.entity';
import { BaseDto } from '../base.dto';

export class CreateAttributeDto extends BaseDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  value: string;
  @ApiProperty({
    enum: AttributeType,
    default: AttributeType.TEXT,
  })
  type: AttributeType;
}

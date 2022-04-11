import { PartialType } from '@nestjs/swagger';
import { CreateSaleOptionDto } from './create-sale-option.dto';

export class UpdateSaleOptionDto extends PartialType(CreateSaleOptionDto) {}

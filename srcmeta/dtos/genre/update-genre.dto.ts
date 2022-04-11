import { PartialType } from '@nestjs/mapped-types';
import { CreateGenre } from './createGenre';

export class UpdateAttributeDto extends PartialType(CreateGenre) {}

import { IsString } from 'class-validator';

export class MobileDto {
  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly isoCode: string;
}

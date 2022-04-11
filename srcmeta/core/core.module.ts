import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CoreModule {}

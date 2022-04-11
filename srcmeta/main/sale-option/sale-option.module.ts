import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { SaleOptionController } from './controller/sale-option.controller';
import { SaleOptionDao } from './dao/sale-option.dao';
import { SaleOptionService } from './service/sale-option.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [SaleOptionController],
  providers: [SaleOptionService, SaleOptionDao, Neo4jService],
  exports: [SaleOptionService],
})
export class SaleOptionModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { AttributesController } from './controller/attributes.controller';
import { AttributesDao } from './dao/attributes.dao';
import { AttributesService } from './service/attributes.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [AttributesController],
  providers: [AttributesService, AttributesDao, Neo4jService],
  exports: [AttributesService],
})
export class AttributesModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { SeriesController } from './controller/series.controller';
import { SeriesDao } from './dao/series.dao';
import { SeriesService } from './service/series.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [SeriesController],
  providers: [SeriesService, SeriesDao, Neo4jService],
  exports: [SeriesService],
})
export class SeriesModule {}

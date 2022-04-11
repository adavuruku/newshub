import { Neo4jService } from './../../neo4j/neo4j.service/neo4j.service';
import { Module } from '@nestjs/common';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { ConfigService } from '@nestjs/config';
import { GenreDao } from './dao/genre.dao';
import { GenreService } from './service/genre.service';
import { GenreController } from './controller/genre.controller';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [GenreController],
  providers: [GenreDao, GenreService, Neo4jService],
  exports: [GenreService],
})
export class GenreModule {}

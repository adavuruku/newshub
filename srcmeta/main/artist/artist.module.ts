import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { ArtistController } from './controller/artist.controller';
import { ArtistService } from './service/artist.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [ArtistController],
  providers: [ArtistService, Neo4jService],
})
export class ArtistModule {}

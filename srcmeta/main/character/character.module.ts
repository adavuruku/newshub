import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { CharacterController } from './controller/character.controller';
import { CharacterService } from './service/character.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [CharacterController],
  providers: [CharacterService, Neo4jService],
})
export class CharacterModule {}

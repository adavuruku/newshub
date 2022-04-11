import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { SceneController } from './controller/scene.controller';
import { SceneDao } from './dao/scene.dao';
import { SceneService } from './service/scene.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [SceneController],
  providers: [SceneService, SceneDao, Neo4jService],
  exports: [SceneService],
})
export class SceneModule {}

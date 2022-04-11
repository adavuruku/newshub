import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, Neo4jService],
})
export class UserModule {}

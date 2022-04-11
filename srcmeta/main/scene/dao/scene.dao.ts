/* eslint-disable @typescript-eslint/no-unused-vars */
import { Neo4jService } from '../../../neo4j/neo4j.service/neo4j.service';
import { BaseDao } from '../../../core/_base/base.dao/base.dao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SceneDao extends BaseDao {
  public identifier = 'scene';
  protected labelName = 'Scene';

  constructor(protected readonly neo4jService: Neo4jService) {
    super(neo4jService);
  }

  /**
   * To be run on onModuleInit as any entry
   *
   * @param {Neo4jService} neo4jService instance
   * @return returns the response from neo4j
   */
  static initialize(neo4jService: Neo4jService) {
    const initCyphers = `CREATE CONSTRAINT scene_id IF NOT EXISTS ON (scene:Scene) ASSERT scene.scene_id IS UNIQUE`;
    return neo4jService.write(initCyphers, {});
  }
}

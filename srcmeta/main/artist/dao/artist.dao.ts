/* eslint-disable @typescript-eslint/no-unused-vars */
import { Neo4jService } from '../../../neo4j/neo4j.service/neo4j.service';
import { BaseDao } from '../../../core/_base/base.dao/base.dao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArtistDao extends BaseDao {
  public identifier = 'artist';
  protected labelName = 'Artist';

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
    const initCyphers = `CREATE CONSTRAINT artist_id IF NOT EXISTS ON (artist:Artist) ASSERT artist.artist_id IS UNIQUE`;
    return neo4jService.write(initCyphers, {});
  }
}

import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { BaseDao } from '../../../core/_base/base.dao/base.dao';

/**
 * TodoDao class
 */
export class GenreDao extends BaseDao {
  public identifier = 'genre';
  protected labelName = 'Genre';

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
    const initCyphers = `CREATE CONSTRAINT genre_id IF NOT EXISTS ON (genre:Genre) ASSERT genre.genre_id IS UNIQUE`;
    return neo4jService.write(initCyphers, {});
  }
}

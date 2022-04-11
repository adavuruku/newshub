import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { BaseDao } from '../../../../../service/src/core/_base/base.dao/base.dao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttributesDao extends BaseDao {
  public identifier = 'attribute';
  protected labelName = 'Attribute';

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
    const initCyphers = `CREATE CONSTRAINT attribute_id IF NOT EXISTS ON (attribute:Attribute) ASSERT attribute.attribute_id IS UNIQUE`;
    return neo4jService.write(initCyphers, {});
  }
}

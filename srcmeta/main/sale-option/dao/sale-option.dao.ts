import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Injectable } from '@nestjs/common';
import { BaseDao } from './../../../core/_base/base.dao/base.dao';

@Injectable()
export class SaleOptionDao extends BaseDao {
  public identifier = 'saleOption';
  protected labelName = 'SaleOption';

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
    const initCyphers = `CREATE CONSTRAINT saleOption_id IF NOT EXISTS ON (saleOption:SaleOption) ASSERT saleOption.saleOption_id IS UNIQUE`;
    return neo4jService.write(initCyphers, {});
  }
}

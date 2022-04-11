import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../../service/src/core/_base';
import { SaleOptionDao } from '../dao/sale-option.dao';

@Injectable()
export class SaleOptionService extends BaseService {
  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new SaleOptionDao(this.neo4jService);
  }
  public identifier = 'series';
}

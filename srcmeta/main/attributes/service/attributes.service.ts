import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../../service/src/core/_base';
import { AttributesDao } from '../dao/attributes.dao';

@Injectable()
export class AttributesService extends BaseService {
  public identifier = 'attribute';

  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new AttributesDao(this.neo4jService);
  }
}

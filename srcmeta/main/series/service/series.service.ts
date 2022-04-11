import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../../service/src/core/_base';
import { SeriesDao } from '../dao/series.dao';

@Injectable()
export class SeriesService extends BaseService {
  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new SeriesDao(this.neo4jService);
  }
  public identifier = 'series';
}

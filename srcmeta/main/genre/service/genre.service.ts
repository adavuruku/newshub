import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../core/_base';
import { GenreDao } from '../dao/genre.dao';

@Injectable()
export class GenreService extends BaseService {
  public identifier = 'genre';

  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new GenreDao(this.neo4jService);
  }
}

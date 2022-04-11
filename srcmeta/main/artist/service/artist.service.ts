import { ArtistDao } from './../dao/artist.dao';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../../service/src/core/_base';
import { Neo4jService } from '../../../../../service/src/neo4j/neo4j.service/neo4j.service';

@Injectable()
export class ArtistService extends BaseService {
  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new ArtistDao(this.neo4jService);
  }
  public identifier = 'artists';
}

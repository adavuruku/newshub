import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Injectable } from '@nestjs/common';
import { CharacterDao } from '../dao/character.dao';
import { BaseService } from '../../../../../service/src/core/_base';

@Injectable()
export class CharacterService extends BaseService {
  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new CharacterDao(this.neo4jService);
  }
  public identifier = 'characters';
}

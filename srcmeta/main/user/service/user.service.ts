import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../../service/src/core/_base';
import { Neo4jService } from '../../../../../service/src/neo4j/neo4j.service/neo4j.service';
import { UserDao } from '../dao/user.dao';

@Injectable()
export class UserService extends BaseService {
  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new UserDao(this.neo4jService);
  }
  public identifier = 'users';
}

import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from './character.service';
class Neo4jServiceMock {}
describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

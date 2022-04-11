import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SceneService } from './scene.service';
class Neo4jServiceMock {}
describe('SceneService', () => {
  let service: SceneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SceneService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();

    service = module.get<SceneService>(SceneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

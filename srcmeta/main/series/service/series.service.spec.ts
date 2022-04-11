import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SeriesService } from './series.service';
class Neo4jServiceMock {}
describe('SeriesService', () => {
  let service: SeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeriesService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    service = module.get<SeriesService>(SeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

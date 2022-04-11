import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AttributesService } from './attributes.service';

describe('AttributesService', () => {
  let service: AttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributesService, { provide: Neo4jService, useValue: {} }],
    }).compile();

    service = module.get<AttributesService>(AttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

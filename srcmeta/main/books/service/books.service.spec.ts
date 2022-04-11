import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';

class Neo4jServiceMock {}

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SaleOptionService } from './sale-option.service';

class Neo4jServiceMock {}
describe('SaleOptionService', () => {
  let saleOptionService: SaleOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleOptionService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    saleOptionService = module.get<SaleOptionService>(SaleOptionService);
  });

  it('should be defined', () => {
    expect(saleOptionService).toBeDefined();
  });
});

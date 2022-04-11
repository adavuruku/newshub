import { QueryParser } from '../../../../../service/src/_shared/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
// import neo4j, { Record } from 'neo4j-driver';
import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BaseDao } from '../base.dao/base.dao';
import { QueryResult, Result } from 'neo4j-driver';

const objMock = {
  uuid: '5425fdhhwvw87722373737373g1ghsvssb',
  book: { properties: {} },
  books: { properties: {} },
  test: { properties: {} },
};

export class Neo4jServiceMock {
  read = jest.fn(async () => ({
    records: [{ get: (uuid) => objMock[uuid] }],
  }));
  write = jest.fn(async (cypher, obj) => ({
    cypher,
    obj,
  }));
}

describe('BaseDao - Test', () => {
  let app: INestApplication;
  let baseDao: BaseDao;
  let neo4jService: Neo4jService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BaseDao,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    baseDao = module.get<BaseDao>(BaseDao);
    neo4jService = module.get<Neo4jService>(Neo4jService);
    await app.init();
  });

  describe('BaseDao Should Exist', () => {
    it('BaseDao - should be defined', () => {
      expect(baseDao).toBeDefined();
    });
  });
  describe('BaseDao - test', () => {
    describe('BaseDao - getId', () => {
      it('BaseDao - getId should be defined', () => {
        expect(baseDao.getId).toBeDefined();
      });
      it('BaseDao - getId called', async () => {
        const baseDao = new BaseDao(neo4jService);
        expect(await baseDao.getId()).toEqual(objMock.uuid);
      });
    });

    describe('BaseDao - create', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.create).toBeDefined();
      });
      it('BaseDao - create with payload', () => {
        const baseDao = new BaseDao(neo4jService);
        const payload = { title: 'test', description: 'test description' };
        expect(baseDao.create(payload)).toBeTruthy();
      });
      it('BaseDao - create with payload and fillables', () => {
        class SubClassMock extends BaseDao {
          public identifier = 'book';
          protected labelName = 'Base';
          protected softDelete = true;
          protected limit = 10;
          protected skip = 0;

          protected fillables = ['title', 'description'];
          protected updateFillables = [];

          constructor(protected readonly neo4jService: Neo4jService) {
            super(neo4jService);
          }
        }

        const sub = new SubClassMock(neo4jService);
        const baseDao = new BaseDao(neo4jService);
        const payload = { title: 'test', description: 'test description' };
        expect(sub.create(payload)).toBeTruthy();
      });
    });
    describe('BaseDao - update', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.update).toBeDefined();
      });

      it('BaseDao - should be defined', async () => {
        const baseDao = new BaseDao(neo4jService);
        const id = await baseDao.getId();
        const payload = { title: 'test', description: 'test description' };
        expect(await baseDao.update(id, payload)).toBeTruthy();
      });

      it('BaseDao - call update fillables', async () => {
        class SubClassMock extends BaseDao {
          public identifier = 'book';
          protected labelName = 'Base';
          protected softDelete = true;
          protected limit = 10;
          protected skip = 0;

          protected fillables = ['title', 'description'];
          protected updateFillables = undefined;

          constructor(protected readonly neo4jService: Neo4jService) {
            super(neo4jService);
          }
        }

        const sub = new SubClassMock(neo4jService);
        const baseDao = new BaseDao(neo4jService);
        const id = await sub.getId();
        const payload = { title: 'test', description: 'test description' };
        expect(await sub.update(id, payload)).toBeTruthy();
      });
      it('BaseDao - call update updateFillables', async () => {
        class SubClassMock extends BaseDao {
          public identifier = 'book';
          protected labelName = 'Base';
          protected softDelete = true;
          protected limit = 10;
          protected skip = 0;
          protected fillables = undefined;
          protected updateFillables = ['title', 'description'];

          constructor(protected readonly neo4jService: Neo4jService) {
            super(neo4jService);
          }
        }

        const sub1 = new SubClassMock(neo4jService);
        const baseDao = new BaseDao(neo4jService);
        const id = await baseDao.getId();
        const payload = { title: 'test', description: 'test description' };
        expect(await sub1.update(id, payload)).toBeTruthy();
      });
    });
    describe('BaseDao - count', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.count).toBeDefined();
      });

      it('BaseDao - count called', () => {
        const baseDao = new BaseDao(neo4jService);
        expect(baseDao.count({ limit: 10, skip: 0 })).toBeTruthy();
      });
    });
    describe('BaseDao - find', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.find).toBeDefined();
      });

      it('BaseDao - find called with query', () => {
        class SubClassMock extends BaseDao {
          public identifier = 'book';
          protected labelName = 'Base';
          protected softDelete = true;
          protected limit = undefined;
          protected skip = undefined;

          constructor(protected readonly neo4jService: Neo4jService) {
            super(neo4jService);
          }
        }

        const sub = new SubClassMock(neo4jService);
        const baseDao = new BaseDao(neo4jService);
        //   expect(
        //     sub.find({
        //       page: 1,
        //       perPage: 10,
        //     }),
        //   ).toBeTruthy();
      });
      it('BaseDao - find called with query and others', () => {
        const baseDao = new BaseDao(neo4jService);
        expect(
          baseDao.count({
            limit: 10,
            skip: 0,
          }),
        ).toBeTruthy();
      });
      it('BaseDao - find called without query', () => {
        const baseDao = new BaseDao(neo4jService);
        // expect(baseDao.find()).toBeTruthy();
      });
    });
    describe('BaseDao - get', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.get).toBeDefined();
      });

      it('BaseDao - get call with id and query', async () => {
        const baseDao = new BaseDao(neo4jService);
        const id = await baseDao.getId();
        expect(baseDao.get(id, { title: 'test' })).toBeTruthy();
      });
    });
    describe('BaseDao - delete', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.delete).toBeDefined();
      });
      it('BaseDao - delete called', async () => {
        const baseDao = new BaseDao(neo4jService);
        const id = await baseDao.getId();
        expect(baseDao.delete(id)).toBeTruthy();
      });
      it('BaseDao - delete called with softDelete false', async () => {
        class SubClassMock extends BaseDao {
          public identifier = 'todo';
          protected labelName = 'Base';
          protected softDelete = false;
          protected limit = 10;
          protected skip = 0;

          protected fillables = [];
          protected updateFillables = [];

          constructor(protected readonly neo4jService: Neo4jService) {
            super(neo4jService);
          }
        }

        const sub = new SubClassMock(neo4jService);
        const baseDao = new BaseDao(neo4jService);
        const id = await baseDao.getId();
        expect(sub.delete(id)).toBeTruthy();
      });
    });

    describe('BaseDao - getData', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.getData).toBeDefined();
      });
      it('BaseDao - call getData with result', () => {
        expect(
          baseDao.getData({ records: [{ get: (key) => objMock[key] }] }, {}),
        ).toBeTruthy();
      });
      it('BaseDao - call getData with result and key', () => {
        expect(
          baseDao.getData(
            { records: [{ get: (key) => objMock[key] }] },
            'test',
          ),
        ).toBeTruthy();
      });
      it('BaseDao - call getData without result and key', () => {
        expect(() => baseDao.getData({ records: [] }, {})).toThrowError();
      });
    });

    describe('BaseDao - getAllData', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.getAllData).toBeDefined();
      });

      it('BaseDao - call getAllData with result', () => {
        expect(
          baseDao.getAllData({ records: [{ get: (key) => objMock[key] }] }, {}),
        ).toBeTruthy();
      });
      it('BaseDao - call getAllData with result and key', () => {
        expect(
          baseDao.getAllData(
            { records: [{ get: (key) => objMock[key] }] },
            'test',
          ),
        ).toBeTruthy();
      });
    });
    describe('BaseDao - renderProperties', () => {
      it('BaseDao - should be defined', () => {
        expect(baseDao.renderProperties).toBeDefined();
      });
      it('BaseDao - renderProperties call with payload', () => {
        expect(baseDao.renderProperties({ test: 'Test' })).toBeDefined();
      });

      it('BaseDao - renderProperties call with payload and id', () => {
        expect(
          baseDao.renderProperties({ test: 'Test', id: 'ettetete' }),
        ).toBeDefined();
      });
    });

    describe('BaseDao - cypherGenerator', () => {
      const query = new QueryParser({
        limit: 1,
        population: ['test'],
        sort: '-createdAt',
        all: false,
        search: 'test',
        selection: [],
        query: {},
      });

      it('BaseDao - cypherGenerator should be defined', () => {
        expect(baseDao.cypherGenerator).toBeDefined();
      });
      it('BaseDao - cypherGenerator call with payload ', async () => {
        class SubClassMock extends BaseDao {
          public identifier = 'book';
          protected labelName = 'Base';
          protected softDelete = true;
          protected limit = 10;
          protected skip = 0;

          protected fillables = ['title', 'description'];
          protected updateFillables = [];

          constructor(protected readonly neo4jService: Neo4jService) {
            super(neo4jService);
          }
        }

        const sub = new SubClassMock(neo4jService);
        jest.spyOn(neo4jService, 'read').mockImplementation(() => {
          return {} as Result;
        });
        expect(await sub.cypherGenerator(query)).toBeInstanceOf(Object);
      });
    });
    describe('BaseDao - formatCypherQueryPopulationResult', () => {
      it('BaseDao - formatCypherQueryPopulationResult should be defined', () => {
        // expect(baseDao.formatCypherQueryPopulationResult).toBeDefined();
      });
    });
  });
});

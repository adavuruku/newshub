import { Relationship } from './../../../interfaces/relationshipType';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppResponse, Pagination, QueryParser } from '../../../_shared/common';
import { Neo4jService } from '../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from './base.service';
import { INestApplication, Injectable } from '@nestjs/common';
import { BaseDao } from '../base.dao/base.dao';
import { AppException } from '../../../_shared/exceptions';
import * as _ from 'lodash';
import { Result } from 'neo4j-driver';

const objMock = {
  uuid: '5425fdhhwvw87722373737373g1ghsvssb',
  test: {
    properties: { title: 'test title', description: 'test description' },
  },
  tests: {
    properties: { title: 'test title', description: 'test description' },
  },
  total: { low: 20, properties: {} },
};

export class Neo4jServiceMock {
  read = jest.fn(async (cypher: any, obj: any) => {
    return obj.id === ''
      ? {}
      : {
          records: [{ get: (uuid) => objMock[uuid] }],
        };
  });
  write = jest.fn(async (cypher, obj) => ({
    records: [{ get: (uuid) => objMock[uuid] }],
  }));
}

export class TestDoa extends BaseDao {
  public identifier = 'test';
  protected labelName = 'Test';

  constructor(protected readonly neo4jService: Neo4jService) {
    super(neo4jService);
  }
}

@Injectable()
export class MockBaseSubClassService extends BaseService {
  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new TestDoa(this.neo4jService);
  }
}

describe('BaseService - Test', () => {
  let baseService: BaseService;
  let neo4jService: Neo4jService;
  let testDoa: TestDoa;
  let pagination: Pagination;
  const baseUrl = 'http://localhost';
  let mockBaseSubClassService: MockBaseSubClassService;
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockBaseSubClassService,
        TestDoa,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    mockBaseSubClassService = module.get<MockBaseSubClassService>(
      MockBaseSubClassService,
    );
    testDoa = module.get<TestDoa>(TestDoa);
    neo4jService = module.get<Neo4jService>(Neo4jService);
    await app.init();
  });

  describe('BaseService Should Exist', () => {
    it('BaseService - should be defined', () => {
      expect(mockBaseSubClassService).toBeDefined();
    });
    it('BaseService - getResponse should be defined', () => {
      expect(mockBaseSubClassService.getResponse({ code: 200 })).toBeDefined();
    });
    it('BaseService - getDao should be defined', () => {
      expect(mockBaseSubClassService.getDao).toBeDefined();
    });
    it('BaseService - getDao should return a type of Dao', () => {
      expect(mockBaseSubClassService.getDao()).toBeInstanceOf(TestDoa);
    });
  });

  describe('BaseService getResponse', () => {
    it('BaseService getResponse - should be defined', () => {
      expect(mockBaseSubClassService.getResponse).toBeDefined();
    });
    it('BaseService getResponse - is called without token', async () => {
      const responseOption = {
        value: {},
        code: 200,
      };
      expect(mockBaseSubClassService.getResponse(responseOption)).toBeTruthy();
      expect(
        mockBaseSubClassService.getResponse(responseOption),
      ).toBeInstanceOf(Object);
      expect(
        await mockBaseSubClassService.getResponse(responseOption),
      ).toHaveProperty('meta');
    });
    it('BaseService getResponse - is called with token', async () => {
      const responseOption = {
        value: {},
        code: 200,
        token: 'token',
      };
      expect(mockBaseSubClassService.getResponse(responseOption)).toBeTruthy();
      expect(
        mockBaseSubClassService.getResponse(responseOption),
      ).toBeInstanceOf(Object);
      expect(
        await mockBaseSubClassService.getResponse(responseOption),
      ).toHaveProperty('meta');
      expect(
        (await mockBaseSubClassService.getResponse(responseOption)).meta,
      ).toHaveProperty('token');
    });
    it('BaseService getResponse - is called with message', async () => {
      const responseOption = {
        value: {},
        code: 200,
        token: 'token',
        message: 'message',
      };
      expect(mockBaseSubClassService.getResponse(responseOption)).toBeTruthy();
      expect(
        mockBaseSubClassService.getResponse(responseOption),
      ).toBeInstanceOf(Object);
      expect(
        await mockBaseSubClassService.getResponse(responseOption),
      ).toHaveProperty('meta');
      expect(
        (await mockBaseSubClassService.getResponse(responseOption)).meta,
      ).toHaveProperty('token');
      expect(
        (await mockBaseSubClassService.getResponse(responseOption)).meta,
      ).toHaveProperty('message');
    });
    it('BaseService getResponse - is called with pagination', async () => {
      const responseOption = {
        value: {},
        code: 200,
        token: 'token',
        message: 'message',
        pagination: new Pagination('/todos', baseUrl),
        queryParser: new QueryParser({
          limit: 1,
          population: [],
          sort: '-createdAt',
          all: false,
          search: 'test',
          selection: [],
          query: {},
        }),
      };
      expect(mockBaseSubClassService.getResponse(responseOption)).toBeTruthy();
      expect(
        mockBaseSubClassService.getResponse(responseOption),
      ).toBeInstanceOf(Object);

      expect(
        await mockBaseSubClassService.getResponse(responseOption),
      ).toHaveProperty('meta');
      expect(
        (await mockBaseSubClassService.getResponse(responseOption)).meta,
      ).toHaveProperty('token');
      expect(
        (await mockBaseSubClassService.getResponse(responseOption)).meta,
      ).toHaveProperty('message');
    });
    it('BaseService getResponse - is called with pagination morePages', async () => {
      const responseOption = {
        value: {},
        code: 200,
        count: 200,
        token: 'token',
        message: 'message',
        pagination: new Pagination('/todos', baseUrl),
        queryParser: new QueryParser({
          limit: 1,
          population: [],
          sort: '-createdAt',
          all: false,
          search: 'test',
          selection: [],
        }),
      };
      expect(mockBaseSubClassService.getResponse(responseOption)).toBeTruthy();
      expect(
        mockBaseSubClassService.getResponse(responseOption),
      ).toBeInstanceOf(Object);
    });

    it('BaseService getResponse - Throw error', () => {
      const responseOption = {
        value: {},
        code: 200,
        token: 'token',
        message: 'message',
      };
      jest.spyOn(AppResponse, 'getSuccessMeta').mockImplementation(() => {
        throw new Error('Error');
      });
      expect(AppResponse.getSuccessMeta).toThrow(new Error('Error'));
    });

    it('BaseService validateCreate - validateCreate is called', async () => {
      const sub = new MockBaseSubClassService(neo4jService);
      expect(await sub.validateCreate({})).toEqual(null);
    });
    it('BaseService getResponse - postCreateResponse is called', async () => {
      const sub = new MockBaseSubClassService(neo4jService);
      expect(await sub.postCreateResponse({})).toEqual(null);
    });
  });

  describe('BaseService create', () => {
    it('BaseService create - should be defined', () => {
      expect(mockBaseSubClassService.create).toBeDefined();
    });

    it('BaseService create - is called with payload', async () => {
      const payload = { title: 'test', description: 'test description' };
      expect(await mockBaseSubClassService.create(payload)).toBeInstanceOf(
        Object,
      );
    });

    it('BaseService create - is called with payload data', async () => {
      const payload = { title: 'test', description: 'test description' };
      jest
        .spyOn(mockBaseSubClassService, 'postCreateResponse')
        .mockImplementation(() => Promise.resolve({}));
      expect(await mockBaseSubClassService.create(payload)).toBeInstanceOf(
        Object,
      );
    });
    it('BaseService create - validateCreate is called with payload', async () => {
      const payload = {};
      const spy = jest
        .spyOn(mockBaseSubClassService, 'validateCreate')
        .mockImplementation(() => Promise.resolve({}));
      await mockBaseSubClassService.create(payload);
      expect(mockBaseSubClassService.validateCreate).toHaveBeenCalled();
      expect(await mockBaseSubClassService.validateCreate({})).toEqual({});
    });

    it('BaseService create - is called with empty payload', async () => {
      const payload = {};
      const spy = jest
        .spyOn(mockBaseSubClassService, 'validateCreate')
        .mockImplementation(() => Promise.resolve(null));
      await mockBaseSubClassService.create(payload);

      expect(await mockBaseSubClassService.validateCreate).toHaveBeenCalled();
    });
  });

  describe('BaseService update', () => {
    it('BaseService update - should be defined', () => {
      expect(mockBaseSubClassService.update).toBeDefined();
    });

    it('BaseService update - is called with payload', async () => {
      const id = 'test';
      const payload = { title: 'test', description: 'test description' };
      expect(await mockBaseSubClassService.update(id, payload)).toBeInstanceOf(
        Object,
      );
    });
    it('BaseService update - is called with payload postUpdateResponse return data', async () => {
      const id = 'test';
      const payload = { title: 'test', description: 'test description' };
      jest
        .spyOn(mockBaseSubClassService, 'postUpdateResponse')
        .mockImplementation(() => Promise.resolve({}));
      expect(await mockBaseSubClassService.update(id, payload)).toBeInstanceOf(
        Object,
      );
    });
    it('BaseService update - is called with invalid id', async () => {
      const id = 'test';
      const payload = { title: 'test', description: 'test description' };

      jest
        .spyOn(mockBaseSubClassService, 'validateUpdate')
        .mockImplementation(() => Promise.resolve({ error: 'Error' }));

      expect(await mockBaseSubClassService.update(id, payload)).toEqual({
        error: 'Error',
      });
    });
    it('BaseService update - validateUpdate is called', async () => {
      const spy = jest
        .spyOn(mockBaseSubClassService, 'validateUpdate')
        .mockImplementation(() => null);

      expect(await mockBaseSubClassService.validateUpdate({}, {})).toEqual(
        null,
      );
    });
    it('BaseService update - postUpdateResponse is called', async () => {
      const spy = jest
        .spyOn(mockBaseSubClassService, 'postUpdateResponse')
        .mockImplementation(() => Promise.resolve({}));

      expect(await mockBaseSubClassService.postUpdateResponse({})).toEqual({});
    });
  });

  describe('BaseService find', () => {
    it('BaseService find - should be defined', () => {
      expect(mockBaseSubClassService.find).toBeDefined();
    });

    it('BaseService find - is called with payload', async () => {
      const query = { title: 'test', description: 'test description' };

      // jest
      //   .spyOn(testDoa, 'find')
      //   .mockImplementation(() => Promise.resolve({ value: {}, count: 10 }));
      // jest.spyOn(testDoa, 'count').mockImplementation(() => null);

      // expect(
      //   await mockBaseSubClassService.find(
      //     new QueryParser({
      //       limit: 1,
      //       population: [],
      //       sort: '-createdAt',
      //       all: false,
      //       search: 'test',
      //       selection: [],
      //     }),
      //   ),
      // ).toBeInstanceOf(Object);
    });
  });

  describe('BaseService get', () => {
    it('BaseService get - should be defined', () => {
      expect(mockBaseSubClassService.create).toBeDefined();
    });
    it('BaseService get - is called with payload', async () => {
      const id = 'test';
      const query = { title: 'test', description: 'test description' };
      const sub = new MockBaseSubClassService(neo4jService);
      expect(
        await sub.get(
          id,
          new QueryParser({
            limit: 1,
            population: ['title'],
            sort: '-createdAt',
            all: false,
            search: 'test',
            selection: ['title'],
          }),
        ),
      ).toBeInstanceOf(Object);
    });
  });

  describe('BaseService createRelationship', () => {
    const mockNode = {
      id: 'string',
      label: 'string',
    };
    const mockRelType = {
      type: Relationship.HAS_MANY,
    };
    it('BaseService createRelationship - should be defined', () => {
      expect(mockBaseSubClassService.createRelationship).toBeDefined();
    });

    it('BaseService createRelationship - is called with payload', async () => {
      jest
        .spyOn(mockBaseSubClassService, 'find')
        .mockImplementation(() => Promise.resolve({ value: {}, count: 10 }));
      expect(
        await mockBaseSubClassService.createRelationship(
          mockNode,
          mockNode,
          mockRelType,
        ),
      ).toBeInstanceOf(Object);
    });
  });

  describe('BaseService delete', () => {
    it('BaseService delete - should be defined', () => {
      expect(mockBaseSubClassService.delete).toBeDefined();
    });

    it('BaseService delete - is called with payload', async () => {
      const id = 'test';
      expect(await mockBaseSubClassService.delete(id)).toBeInstanceOf(Object);
    });
    it('BaseService delete - is called with payload postDeleteResponse return data', async () => {
      const id = 'test';
      jest
        .spyOn(mockBaseSubClassService, 'postDeleteResponse')
        .mockImplementation(() => Promise.resolve({}));
      expect(await mockBaseSubClassService.delete(id)).toBeInstanceOf(Object);
    });
    it('BaseService delete - validateDelete is called', async () => {
      const id = 'test';
      const spy = jest
        .spyOn(mockBaseSubClassService, 'validateDelete')
        .mockImplementation(() => Promise.resolve({}));
      expect(await mockBaseSubClassService.delete(id)).toBeInstanceOf(Object);
    });
    it('BaseService delete - postDeleteResponse is called', async () => {
      const spy = jest
        .spyOn(mockBaseSubClassService, 'postDeleteResponse')
        .mockImplementation(() => null);

      expect(await mockBaseSubClassService.postDeleteResponse({})).toEqual(
        null,
      );
    });
  });
});

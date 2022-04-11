import { SceneQueryDto } from './../../../dtos/scene/scene-query.dto';
import { QueryParser } from './../../../_shared/common/query-parser/query-parser';
import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SceneService } from '../service/scene.service';
import { SceneController } from './scene.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { NextFunction } from 'express';
import * as mock from 'node-mocks-http';
import {
  AppResponse,
  Pagination,
} from '../../../../../service/src/_shared/common';

class Neo4jServiceMock {}
describe('SceneController', () => {
  let sceneController: SceneController;
  let sceneService: SceneService;
  let sceneMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let query: SceneQueryDto;
  let queryParser: QueryParser;
  let apiResponse;
  const sceneId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SceneController],
      providers: [
        SceneService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    sceneController = module.get<SceneController>(SceneController);
    sceneService = module.get<SceneService>(SceneService);

    await app.init();
    sceneMock = {
      title: 'test scene',
      description: 'Test description',
      coverImage: 'testscenecover.png',
      explicitContent: true,
    };
    query = {};

    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(sceneController).toBeDefined();
  });

  describe('Create Scene', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: sceneMock,
      };
      jest
        .spyOn(sceneService, 'create')
        .mockImplementation(() => Promise.resolve(sceneMock));

      jest
        .spyOn(sceneService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(sceneService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await sceneController.create(sceneMock, response, request, next);
      expect(sceneService.create).toThrow(new Error('Error'));
    });

    it('should call create method with expected payload', async () => {
      await sceneController.create(sceneMock, response, request, next);
      expect(sceneService.create).toHaveBeenCalledWith(sceneMock);
      expect(sceneService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: sceneMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find scene', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: sceneMock,
      };
      jest
        .spyOn(sceneService, 'find')
        .mockImplementation(() =>
          Promise.resolve({ value: [sceneMock], count: 1 }),
        );

      jest
        .spyOn(sceneService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('Find scene should throw error', async () => {
      jest.spyOn(sceneService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await sceneController.findAll(response, request, next, query);
      expect(sceneService.find).toThrow(new Error('Error'));
    });
    it('should call FindAll method with expected payload', async () => {
      await sceneController.findAll(response, request, next, query);
      queryParser.population = [];
      expect(sceneService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        sceneService.baseUrl,
        sceneService.itemsPerPage,
      );

      expect(sceneService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [sceneMock],
        count: [sceneMock].length,
        queryParser,
        pagination,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Get Scene', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: sceneMock,
      };
      jest
        .spyOn(sceneService, 'get')
        .mockImplementation(() => Promise.resolve(sceneMock));

      jest
        .spyOn(sceneService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('FindOne scene should throw error', async () => {
      jest.spyOn(sceneService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await sceneController.findOne(sceneId, query, response, request, next);
      expect(sceneService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne scene method with expected payload', async () => {
      await sceneController.findOne(sceneId, query, response, request, next);

      expect(sceneService.get).toHaveBeenCalledWith(sceneId, queryParser);

      expect(sceneService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: sceneMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Scene', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: sceneMock,
      };
      jest
        .spyOn(sceneService, 'update')
        .mockImplementation(() => Promise.resolve(sceneMock));

      jest
        .spyOn(sceneService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(sceneService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await sceneController.update(sceneId, sceneMock, response, request, next);
      expect(sceneService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await sceneController.update(sceneId, sceneMock, response, request, next);
      expect(sceneService.update).toHaveBeenCalledWith(sceneId, sceneMock);
      expect(sceneService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: sceneMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Scene', () => {
    const deleteMock = {
      id: sceneId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(sceneService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(sceneService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(sceneService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await sceneController.remove(sceneId, response, next);
      expect(sceneService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await sceneController.remove(sceneId, response, next);
      expect(sceneService.delete).toHaveBeenCalledWith(sceneId);
      expect(sceneService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

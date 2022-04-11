import { QueryParser } from './../../../_shared/common/query-parser/query-parser';
import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SeriesService } from '../service/series.service';
import { SeriesController } from './series.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { NextFunction } from 'express';
import * as mock from 'node-mocks-http';
import {
  AppResponse,
  Pagination,
} from '../../../../../service/src/_shared/common';

class Neo4jServiceMock {}

describe('SeriesController', () => {
  let seriesController: SeriesController;
  let seriesService: SeriesService;
  let seriesMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let queryParser: QueryParser;
  let apiResponse;
  const seriesId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesController],
      providers: [
        SeriesService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    seriesController = module.get<SeriesController>(SeriesController);
    seriesService = module.get<SeriesService>(SeriesService);
    app = module.createNestApplication();
    await app.init();

    seriesMock = {};
    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(seriesController).toBeDefined();
  });

  describe('Create Series', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: seriesMock,
      };
      jest
        .spyOn(seriesService, 'create')
        .mockImplementation(() => Promise.resolve(seriesMock));
      jest
        .spyOn(seriesService, 'retrieveExistingResource')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(seriesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(seriesService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await seriesController.create(seriesMock, response, request, next);
      expect(seriesService.create).toThrow(new Error('Error'));
    });
    it('should call create method with expected payload', async () => {
      await seriesController.create(seriesMock, response, request, next);
      expect(seriesService.create).toHaveBeenCalledWith(seriesMock);
      expect(seriesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: seriesMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find All Series', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: [seriesMock],
      };
      queryParser = new QueryParser(Object.assign({}, request.query));
      jest.spyOn(seriesService, 'find').mockImplementation(() =>
        Promise.resolve({
          value: [seriesMock],
          count: [seriesMock].length,
        }),
      );

      jest
        .spyOn(seriesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('Find should throw error', async () => {
      jest.spyOn(seriesService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await seriesController.findAll(response, request, next);
      expect(seriesService.find).toThrow(new Error('Error'));
    });
    it('should call find Attributes method with expected payload', async () => {
      queryParser = new QueryParser(
        Object.assign({}, request.query, { deleted: false }),
      );
      queryParser.population = [];
      await seriesController.findAll(response, request, next);
      expect(seriesService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        seriesService.baseUrl,
        seriesService.itemsPerPage,
      );

      expect(seriesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [seriesMock],
        count: [seriesMock].length,
        queryParser,
        pagination,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Get Single Series', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: seriesMock,
      };
      jest
        .spyOn(seriesService, 'get')
        .mockImplementation(() => Promise.resolve(seriesMock));

      jest
        .spyOn(seriesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('Find Sigle Sale Option should throw error', async () => {
      jest.spyOn(seriesService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await seriesController.findOne(seriesId, response, request, next);
      expect(seriesService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne method with expected payload', async () => {
      await seriesController.findOne(seriesId, response, request, next);
      expect(seriesService.get).toHaveBeenCalledWith(seriesId, {
        deleted: false,
      });
      expect(seriesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: seriesMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Series', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: seriesMock,
      };
      jest
        .spyOn(seriesService, 'update')
        .mockImplementation(() => Promise.resolve(seriesMock));

      jest
        .spyOn(seriesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(seriesService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await seriesController.update(
        seriesId,
        seriesMock,
        response,
        request,
        next,
      );
      expect(seriesService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await seriesController.update(
        seriesId,
        seriesMock,
        response,
        request,
        next,
      );
      expect(seriesService.update).toHaveBeenCalledWith(seriesId, seriesMock);
      expect(seriesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: seriesMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Series', () => {
    const deleteMock = {
      id: seriesId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(seriesService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(seriesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(seriesService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await seriesController.remove(seriesId, response, request, next);
      expect(seriesService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await seriesController.remove(seriesId, response, request, next);
      expect(seriesService.delete).toHaveBeenCalledWith(seriesId);
      expect(seriesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

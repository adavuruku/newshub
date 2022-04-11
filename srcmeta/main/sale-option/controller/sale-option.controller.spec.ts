import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { QueryParser } from './../../../_shared/common/query-parser/query-parser';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction } from 'express';
import { SaleOptionService } from '../service/sale-option.service';
import { SaleOptionController } from './sale-option.controller';
import * as mock from 'node-mocks-http';
import {
  AppResponse,
  Pagination,
} from '../../../../../service/src/_shared/common';

class Neo4jServiceMock {}
describe('SaleOptionController', () => {
  let saleOptionService: SaleOptionService;
  let saleOptionController: SaleOptionController;
  let saleOptionMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let queryParser: QueryParser;
  let apiResponse;
  const saleOptionId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleOptionController],
      providers: [
        SaleOptionService,
        { provide: Neo4jService, useClass: Neo4jServiceMock },
      ],
    }).compile();

    saleOptionController =
      module.get<SaleOptionController>(SaleOptionController);
    saleOptionService = module.get<SaleOptionService>(SaleOptionService);
    app = module.createNestApplication();
    await app.init();

    saleOptionMock = {};
    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(saleOptionController).toBeDefined();
  });

  describe('Create Sale Option', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: saleOptionMock,
      };
      jest
        .spyOn(saleOptionService, 'create')
        .mockImplementation(() => Promise.resolve(saleOptionMock));
      jest
        .spyOn(saleOptionService, 'retrieveExistingResource')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(saleOptionService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(saleOptionService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await saleOptionController.create(
        saleOptionMock,
        response,
        request,
        next,
      );
      expect(saleOptionService.create).toThrow(new Error('Error'));
    });
    it('should call create method with expected payload', async () => {
      await saleOptionController.create(
        saleOptionMock,
        response,
        request,
        next,
      );
      expect(saleOptionService.create).toHaveBeenCalledWith(saleOptionMock);
      expect(saleOptionService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: saleOptionMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find Sale Options', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: [saleOptionMock],
      };
      queryParser = new QueryParser(Object.assign({}, request.query));
      jest.spyOn(saleOptionService, 'find').mockImplementation(() =>
        Promise.resolve({
          value: [saleOptionMock],
          count: [saleOptionMock].length,
        }),
      );

      jest
        .spyOn(saleOptionService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('Find should throw error', async () => {
      jest.spyOn(saleOptionService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await saleOptionController.findAll(response, request, next);
      expect(saleOptionService.find).toThrow(new Error('Error'));
    });
    it('should call find Attributes method with expected payload', async () => {
      queryParser = new QueryParser(
        Object.assign({}, request.query, { deleted: false }),
      );
      queryParser.population = [];
      await saleOptionController.findAll(response, request, next);
      expect(saleOptionService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        saleOptionService.baseUrl,
        saleOptionService.itemsPerPage,
      );

      expect(saleOptionService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [saleOptionMock],
        count: [saleOptionMock].length,
        queryParser,
        pagination,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Get Sale Option', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: saleOptionMock,
      };
      jest
        .spyOn(saleOptionService, 'get')
        .mockImplementation(() => Promise.resolve(saleOptionMock));

      jest
        .spyOn(saleOptionService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('Find Sigle Sale Option should throw error', async () => {
      jest.spyOn(saleOptionService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await saleOptionController.findOne(saleOptionId, response, request, next);
      expect(saleOptionService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne method with expected payload', async () => {
      await saleOptionController.findOne(saleOptionId, response, request, next);
      expect(saleOptionService.get).toHaveBeenCalledWith(saleOptionId, {
        deleted: false,
      });
      expect(saleOptionService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: saleOptionMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Sale option', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: saleOptionMock,
      };
      jest
        .spyOn(saleOptionService, 'update')
        .mockImplementation(() => Promise.resolve(saleOptionMock));

      jest
        .spyOn(saleOptionService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(saleOptionService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await saleOptionController.update(
        saleOptionId,
        saleOptionMock,
        response,
        request,
        next,
      );
      expect(saleOptionService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await saleOptionController.update(
        saleOptionId,
        saleOptionMock,
        response,
        request,
        next,
      );
      expect(saleOptionService.update).toHaveBeenCalledWith(
        saleOptionId,
        saleOptionMock,
      );
      expect(saleOptionService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: saleOptionMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Sale', () => {
    const deleteMock = {
      id: saleOptionId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(saleOptionService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(saleOptionService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(saleOptionService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await saleOptionController.remove(saleOptionId, response, request, next);
      expect(saleOptionService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await saleOptionController.remove(saleOptionId, response, request, next);
      expect(saleOptionService.delete).toHaveBeenCalledWith(saleOptionId);
      expect(saleOptionService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

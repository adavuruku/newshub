import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { QueryParser } from './../../../_shared/common/query-parser/query-parser';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction } from 'express';
import { AttributesService } from '../service/attributes.service';
import { AttributesController } from './attributes.controller';
import * as mock from 'node-mocks-http';
import {
  AppResponse,
  Pagination,
} from '../../../../../service/src/_shared/common';
import { AttributeType } from '../entities/attribute.entity';

class Neo4jServiceMock {}

describe('AttributesController', () => {
  let attributesService: AttributesService;
  let attributesController: AttributesController;
  let attributeMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let queryParser: QueryParser;
  let apiResponse;
  const attributeId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributesController],
      providers: [
        AttributesService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    attributesController = app.get<AttributesController>(AttributesController);
    attributesService = app.get<AttributesService>(AttributesService);
    await app.init();
    attributeMock = {
      title: 'title',
      value: 'value',
      type: AttributeType.TEXT,
    };
    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(attributesController).toBeDefined();
  });

  describe('Create Attribute', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: attributeMock,
      };
      jest
        .spyOn(attributesService, 'create')
        .mockImplementation(() => Promise.resolve(attributeMock));
      jest
        .spyOn(attributesService, 'retrieveExistingResource')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(attributesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(attributesService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await attributesController.createAttribute(
        attributeMock,
        response,
        request,
        next,
      );
      expect(attributesService.create).toThrow(new Error('Error'));
    });
    it('should call create method with expected payload', async () => {
      await attributesController.createAttribute(
        attributeMock,
        response,
        request,
        next,
      );
      expect(attributesService.create).toHaveBeenCalledWith(attributeMock);
      expect(attributesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: attributeMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find Attribute', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: [attributeMock],
      };
      queryParser = new QueryParser(Object.assign({}, request.query));
      jest.spyOn(attributesService, 'find').mockImplementation(() =>
        Promise.resolve({
          value: [attributeMock],
          count: [attributeMock].length,
        }),
      );

      jest
        .spyOn(attributesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('Find should throw error', async () => {
      jest.spyOn(attributesService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await attributesController.findAttributes(response, request, next);
      expect(attributesService.find).toThrow(new Error('Error'));
    });
    it('should call find Attributes method with expected payload', async () => {
      queryParser = new QueryParser(
        Object.assign({}, request.query, { deleted: false }),
      );
      queryParser.population = [];
      await attributesController.findAttributes(response, request, next);
      expect(attributesService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        attributesService.baseUrl,
        attributesService.itemsPerPage,
      );

      expect(attributesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [attributeMock],
        count: [attributeMock].length,
        queryParser,
        pagination,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Get Attribute', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: attributeMock,
      };
      jest
        .spyOn(attributesService, 'get')
        .mockImplementation(() => Promise.resolve(attributeMock));

      jest
        .spyOn(attributesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('Find TodoOne should throw error', async () => {
      jest.spyOn(attributesService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await attributesController.findOne(attributeId, response, request, next);
      expect(attributesService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne method with expected payload', async () => {
      await attributesController.findOne(attributeId, response, request, next);
      expect(attributesService.get).toHaveBeenCalledWith(attributeId, {
        deleted: false,
      });
      expect(attributesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: attributeMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Attribute', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: attributeMock,
      };
      jest
        .spyOn(attributesService, 'update')
        .mockImplementation(() => Promise.resolve(attributeMock));

      jest
        .spyOn(attributesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(attributesService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await attributesController.update(
        attributeId,
        attributeMock,
        response,
        request,
        next,
      );
      expect(attributesService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await attributesController.update(
        attributeId,
        attributeMock,
        response,
        request,
        next,
      );
      expect(attributesService.update).toHaveBeenCalledWith(
        attributeId,
        attributeMock,
      );
      expect(attributesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: attributeMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Attribute', () => {
    const deleteMock = {
      id: attributeId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(attributesService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(attributesService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(attributesService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await attributesController.delete(attributeId, response, request, next);
      expect(attributesService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await attributesController.delete(attributeId, response, request, next);
      expect(attributesService.delete).toHaveBeenCalledWith(attributeId);
      expect(attributesService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

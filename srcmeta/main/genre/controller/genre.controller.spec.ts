import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { QueryParser } from './../../../_shared/common/query-parser/query-parser';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction } from 'express';
import * as mock from 'node-mocks-http';
import {
  AppResponse,
  Pagination,
} from '../../../../../service/src/_shared/common';
import { GenreController } from './genre.controller';
import { GenreService } from '../service/genre.service';

class Neo4jServiceMock {}

describe('GenreController', () => {
  let genreService: GenreService;
  let genreController: GenreController;
  let genreMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let queryParser: QueryParser;
  let apiResponse;
  const genreId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        GenreService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    genreController = app.get<GenreController>(GenreController);
    genreService = app.get<GenreService>(GenreService);
    await app.init();
    genreMock = {
      walletAddress: 'eweeweewrfgfs',
      title: 'title',
      deleted: false,
    };
    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(GenreController).toBeDefined();
  });

  describe('Create Genre', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: genreMock,
      };
      jest
        .spyOn(genreService, 'create')
        .mockImplementation(() => Promise.resolve(genreMock));

      jest
        .spyOn(genreService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
      jest
        .spyOn(genreService, 'retrieveExistingResource')
        .mockImplementation(() => Promise.resolve(null));
    });
    it('should throw error', async () => {
      jest.spyOn(genreService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await genreController.createGenre(genreMock, response, request, next);
      expect(genreService.create).toThrow(new Error('Error'));
    });
    it('should call create method with expected payload', async () => {
      await genreController.createGenre(genreMock, response, request, next);
      expect(genreService.retrieveExistingResource).toHaveBeenCalledWith(
        genreMock,
      );
      expect(genreService.create).toHaveBeenCalledWith(genreMock);
      expect(genreService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: genreMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find Genres', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: genreMock,
      };
      jest
        .spyOn(genreService, 'find')
        .mockImplementation(() =>
          Promise.resolve({ value: [genreMock], count: 1 }),
        );

      jest
        .spyOn(genreService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('FindOne Genre should throw error', async () => {
      jest.spyOn(genreService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await genreController.findGenres(response, request, next);
      expect(genreService.get).toThrow(new Error('Error'));
    });
    it('should call findGenre method with expected payload', async () => {
      await genreController.findGenres(response, request, next);
      queryParser.population = [];
      expect(genreService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        genreService.baseUrl,
        genreService.itemsPerPage,
      );

      expect(genreService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [genreMock],
        count: [genreMock].length,
        queryParser,
        pagination,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Get Genre', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: genreMock,
      };
      jest
        .spyOn(genreService, 'get')
        .mockImplementation(() => Promise.resolve(genreMock));

      jest
        .spyOn(genreService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('FindOne Genre should throw error', async () => {
      jest.spyOn(genreService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await genreController.findOne(genreId, response, request, next);
      expect(genreService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne Genre method with expected payload', async () => {
      await genreController.findOne(genreId, response, request, next);

      expect(genreService.get).toHaveBeenCalledWith(genreId, queryParser);

      expect(genreService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: genreMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Genre', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: genreMock,
      };
      jest
        .spyOn(genreService, 'update')
        .mockImplementation(() => Promise.resolve(genreMock));

      jest
        .spyOn(genreService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(genreService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await genreController.update(genreId, genreMock, response, request, next);
      expect(genreService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await genreController.update(genreId, genreMock, response, request, next);
      expect(genreService.update).toHaveBeenCalledWith(genreId, genreMock);
      expect(genreService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: genreMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Genre', () => {
    const deleteMock = {
      id: genreId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(genreService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(genreService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(genreService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await genreController.delete(genreId, response, next);
      expect(genreService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await genreController.delete(genreId, response, next);
      expect(genreService.delete).toHaveBeenCalledWith(genreId);
      expect(genreService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

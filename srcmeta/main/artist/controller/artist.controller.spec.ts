import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from '../service/artist.service';
import { ArtistController } from './artist.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { NextFunction } from 'express';
import { QueryParser } from '../../../../../service/src/_shared/common/query-parser/query-parser';
import { ArtistDao } from '../dao/artist.dao';

import * as mock from 'node-mocks-http';
import {
  AppResponse,
  Pagination,
} from '../../../../../service/src/_shared/common';

class Neo4jServiceMock {}
describe('ArtistController', () => {
  let artistcontroller: ArtistController;
  let artistService: ArtistService;
  let artistMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let query: ArtistDao;
  let queryParser: QueryParser;
  let apiResponse;
  const artistId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [
        ArtistService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();

    artistcontroller = module.get<ArtistController>(ArtistController);
    artistService = module.get<ArtistService>(ArtistService);
    await app.init();
    artistMock = {
      name: 'test user',
      url: 'http://example.com',
      walletAddress: 'ffehhehhhhrhrh',
    };
    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(artistcontroller).toBeDefined();
  });

  describe('Create Artist', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: artistMock,
      };
      jest
        .spyOn(artistService, 'create')
        .mockImplementation(() => Promise.resolve(artistMock));

      jest
        .spyOn(artistService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      jest
        .spyOn(artistService, 'retrieveExistingResource')
        .mockImplementation(() => Promise.resolve(null));
    });
    it('should throw error', async () => {
      jest.spyOn(artistService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await artistcontroller.create(artistMock, response, request, next);
      expect(artistService.create).toThrow(new Error('Error'));
    });

    it('should call create method with expected payload', async () => {
      await artistcontroller.create(artistMock, response, request, next);
      expect(artistService.retrieveExistingResource).toHaveBeenCalledWith(
        artistMock,
      );
      expect(artistService.create).toHaveBeenCalledWith(artistMock);
      expect(artistService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: artistMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find Artists', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: artistMock,
      };
      jest
        .spyOn(artistService, 'find')
        .mockImplementation(() =>
          Promise.resolve({ value: [artistMock], count: 1 }),
        );

      jest
        .spyOn(artistService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('Find Artist should throw error', async () => {
      jest.spyOn(artistService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await artistcontroller.findAll(response, request, next);
      expect(artistService.find).toThrow(new Error('Error'));
    });
    it('should call findGenre method with expected payload', async () => {
      await artistcontroller.findAll(response, request, next);
      queryParser.population = [];
      expect(artistService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        artistService.baseUrl,
        artistService.itemsPerPage,
      );

      expect(artistService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [artistMock],
        count: [artistMock].length,
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
        data: artistMock,
      };
      jest
        .spyOn(artistService, 'get')
        .mockImplementation(() => Promise.resolve(artistMock));

      jest
        .spyOn(artistService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('FindOne artist should throw error', async () => {
      jest.spyOn(artistService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await artistcontroller.findOne(artistId, response, request, next);
      expect(artistService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne artist method with expected payload', async () => {
      await artistcontroller.findOne(artistId, response, request, next);

      expect(artistService.get).toHaveBeenCalledWith(
        artistId,
        queryParser.query,
      );

      expect(artistService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: artistMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Artist', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: artistMock,
      };
      jest
        .spyOn(artistService, 'update')
        .mockImplementation(() => Promise.resolve(artistMock));

      jest
        .spyOn(artistService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(artistService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await artistcontroller.update(
        artistId,
        artistMock,
        response,
        request,
        next,
      );
      expect(artistService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await artistcontroller.update(
        artistId,
        artistMock,
        response,
        request,
        next,
      );
      expect(artistService.update).toHaveBeenCalledWith(artistId, artistMock);
      expect(artistService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: artistMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Genre', () => {
    const deleteMock = {
      id: artistId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(artistService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(artistService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(artistService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await artistcontroller.remove(artistId, response, next);
      expect(artistService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await artistcontroller.remove(artistId, response, next);
      expect(artistService.delete).toHaveBeenCalledWith(artistId);
      expect(artistService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

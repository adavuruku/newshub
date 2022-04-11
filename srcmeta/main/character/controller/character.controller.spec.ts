import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterService } from '../service/character.service';
import { CharacterController } from './character.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { NextFunction } from 'express';
import {
  AppResponse,
  Pagination,
  QueryParser,
} from '../../../../../service/src/_shared/common';
import * as mock from 'node-mocks-http';
class Neo4jServiceMock {}
describe('CharacterController', () => {
  let characterController: CharacterController;
  let characterService: CharacterService;
  let characterMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let queryParser: QueryParser;
  let apiResponse;
  const characterId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        CharacterService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    characterController = module.get<CharacterController>(CharacterController);
    characterService = module.get<CharacterService>(CharacterService);
    await app.init();
    characterMock = {};

    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(characterController).toBeDefined();
  });

  describe('Create Character', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: characterMock,
      };
      jest
        .spyOn(characterService, 'create')
        .mockImplementation(() => Promise.resolve(characterMock));

      jest
        .spyOn(characterService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      jest
        .spyOn(characterService, 'retrieveExistingResource')
        .mockImplementation(() => Promise.resolve(null));
    });
    it('should throw error', async () => {
      jest.spyOn(characterService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await characterController.create(characterMock, response, request, next);
      expect(characterService.create).toThrow(new Error('Error'));
    });

    it('should call create method with expected payload', async () => {
      await characterController.create(characterMock, response, request, next);
      expect(characterService.retrieveExistingResource).toHaveBeenCalledWith(
        characterMock,
      );
      expect(characterService.create).toHaveBeenCalledWith(characterMock);
      expect(characterService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: characterMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find Characters', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: characterMock,
      };
      jest
        .spyOn(characterService, 'find')
        .mockImplementation(() =>
          Promise.resolve({ value: [characterMock], count: 1 }),
        );

      jest
        .spyOn(characterService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('Find Artist should throw error', async () => {
      jest.spyOn(characterService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await characterController.findAll(response, request, next);
      expect(characterService.find).toThrow(new Error('Error'));
    });
    it('should call findGenre method with expected payload', async () => {
      await characterController.findAll(response, request, next);
      queryParser.population = [];
      expect(characterService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        characterService.baseUrl,
        characterService.itemsPerPage,
      );

      expect(characterService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [characterMock],
        count: [characterMock].length,
        queryParser,
        pagination,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Get Character', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: characterMock,
      };
      jest
        .spyOn(characterService, 'get')
        .mockImplementation(() => Promise.resolve(characterMock));

      jest
        .spyOn(characterService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('FindOne artist should throw error', async () => {
      jest.spyOn(characterService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await characterController.findOne(characterId, response, request, next);
      expect(characterService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne artist method with expected payload', async () => {
      await characterController.findOne(characterId, response, request, next);

      expect(characterService.get).toHaveBeenCalledWith(
        characterId,
        queryParser.query,
      );

      expect(characterService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: characterMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Character', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: characterMock,
      };
      jest
        .spyOn(characterService, 'update')
        .mockImplementation(() => Promise.resolve(characterMock));

      jest
        .spyOn(characterService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(characterService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await characterController.update(
        characterId,
        characterMock,
        response,
        request,
        next,
      );
      expect(characterService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await characterController.update(
        characterId,
        characterMock,
        response,
        request,
        next,
      );
      expect(characterService.update).toHaveBeenCalledWith(
        characterId,
        characterMock,
      );
      expect(characterService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: characterMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Character', () => {
    const deleteMock = {
      id: characterId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(characterService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(characterService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(characterService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await characterController.remove(characterId, response, next);
      expect(characterService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await characterController.remove(characterId, response, next);
      expect(characterService.delete).toHaveBeenCalledWith(characterId);
      expect(characterService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

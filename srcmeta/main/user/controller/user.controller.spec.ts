import { QueryParser } from './../../../_shared/common/query-parser/query-parser';
import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../service/user.service';
import { UserController } from './user.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { NextFunction } from 'express';
import {
  AppResponse,
  Pagination,
} from '../../../../../service/src/_shared/common';

import * as mock from 'node-mocks-http';

class Neo4jServiceMock {}
describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let queryParser: QueryParser;
  let apiResponse;
  const userId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    await app.init();
    userMock = {};

    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('Create User', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: userMock,
      };
      jest
        .spyOn(userService, 'create')
        .mockImplementation(() => Promise.resolve(userMock));

      jest
        .spyOn(userService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      jest
        .spyOn(userService, 'retrieveExistingResource')
        .mockImplementation(() => Promise.resolve(null));
    });
    it('should throw error', async () => {
      jest.spyOn(userService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await userController.create(userMock, response, request, next);
      expect(userService.create).toThrow(new Error('Error'));
    });

    it('should call create method with expected payload', async () => {
      await userController.create(userMock, response, request, next);
      expect(userService.retrieveExistingResource).toHaveBeenCalledWith(
        userMock,
      );
      expect(userService.create).toHaveBeenCalledWith(userMock);
      expect(userService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: userMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find Users', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: userMock,
      };
      jest
        .spyOn(userService, 'find')
        .mockImplementation(() =>
          Promise.resolve({ value: [userMock], count: 1 }),
        );

      jest
        .spyOn(userService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('Find Users should throw error', async () => {
      jest.spyOn(userService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await userController.findAll(response, request, next);
      expect(userService.find).toThrow(new Error('Error'));
    });
    it('should call findGenre method with expected payload', async () => {
      await userController.findAll(response, request, next);
      queryParser.population = [];
      expect(userService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        userService.baseUrl,
        userService.itemsPerPage,
      );

      expect(userService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [userMock],
        count: [userMock].length,
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
        data: userMock,
      };
      jest
        .spyOn(userService, 'get')
        .mockImplementation(() => Promise.resolve(userMock));

      jest
        .spyOn(userService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('FindOne User should throw error', async () => {
      jest.spyOn(userService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await userController.findOne(userId, response, request, next);
      expect(userService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne User method with expected payload', async () => {
      await userController.findOne(userId, response, request, next);

      expect(userService.get).toHaveBeenCalledWith(userId, queryParser.query);

      expect(userService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: userMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update User', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: userMock,
      };
      jest
        .spyOn(userService, 'update')
        .mockImplementation(() => Promise.resolve(userMock));

      jest
        .spyOn(userService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(userService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await userController.update(userId, userMock, response, request, next);
      expect(userService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await userController.update(userId, userMock, response, request, next);
      expect(userService.update).toHaveBeenCalledWith(userId, userMock);
      expect(userService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: userMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete User', () => {
    const deleteMock = {
      id: userId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(userService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(userService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(userService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await userController.remove(userId, response, next);
      expect(userService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await userController.remove(userId, response, next);
      expect(userService.delete).toHaveBeenCalledWith(userId);
      expect(userService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

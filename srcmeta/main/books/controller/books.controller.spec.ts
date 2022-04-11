import { BookQueryDto } from './../../../dtos/books/books-query.dto';
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
import { BooksController } from './books.controller';
import { BooksService } from '../service/books.service';

class Neo4jServiceMock {}

describe('BooksController', () => {
  let booksService: BooksService;
  let booksController: BooksController;
  let bookMock;
  let app: INestApplication;
  const next: NextFunction = jest.fn();
  let request;
  let response;
  let query: BookQueryDto;
  let queryParser: QueryParser;
  let apiResponse;
  const bookId = '354ttte6226633663';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: Neo4jService,
          useClass: Neo4jServiceMock,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    booksController = app.get<BooksController>(BooksController);
    booksService = app.get<BooksService>(BooksService);
    await app.init();
    bookMock = {
      title: 'title',
      value: 'value',
    };
    request = mock.createRequest();
    response = mock.createResponse();
    queryParser = new QueryParser(Object.assign({}, request.query));
  });

  it('should be defined', () => {
    expect(booksController).toBeDefined();
  });

  describe('Create Book', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: bookMock,
      };
      jest
        .spyOn(booksService, 'create')
        .mockImplementation(() => Promise.resolve(bookMock));

      jest
        .spyOn(booksService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(booksService, 'create').mockImplementation(() => {
        throw new Error('Error');
      });
      await booksController.create(bookMock, response, request, next);
      expect(booksService.create).toThrow(new Error('Error'));
    });
    it('should call create method with expected payload', async () => {
      await booksController.create(bookMock, response, request, next);
      expect(booksService.create).toHaveBeenCalledWith(bookMock);
      expect(booksService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: bookMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Find books', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: [bookMock],
      };
      jest.spyOn(booksService, 'find').mockImplementation(() =>
        Promise.resolve(
          Promise.resolve({
            value: [bookMock],
            count: [bookMock].length,
          }),
        ),
      );

      jest
        .spyOn(booksService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });

    it('FindOne should throw error', async () => {
      query = {} as BookQueryDto;
      jest.spyOn(booksService, 'find').mockImplementation(() => {
        throw new Error('Error');
      });
      await booksController.findBooks(response, request, next, query);
      expect(booksService.find).toThrow(new Error('Error'));
    });
    it('should call fine all book method with expected payload', async () => {
      await booksController.findBooks(response, request, next, request.query);

      queryParser = new QueryParser(
        Object.assign(
          {},
          request.query,
          { deleted: false },
          { population: [] },
        ),
      );

      expect(booksService.find).toHaveBeenCalledWith(queryParser);
      const pagination = new Pagination(
        request.originalUrl,
        booksService.baseUrl,
        booksService.itemsPerPage,
      );

      expect(booksService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: [bookMock],
        count: [bookMock].length,
        queryParser,
        pagination,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Get Book', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: bookMock,
      };
      jest
        .spyOn(booksService, 'get')
        .mockImplementation(() => Promise.resolve(bookMock));

      jest
        .spyOn(booksService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('FindOne should throw error', async () => {
      jest.spyOn(booksService, 'get').mockImplementation(() => {
        throw new Error('Error');
      });
      await booksController.findOne(bookId, query, response, request, next);
      expect(booksService.get).toThrow(new Error('Error'));
    });
    it('should call FindOne method with expected payload', async () => {
      await booksController.findOne(
        bookId,
        request.query,
        response,
        request,
        next,
      );

      queryParser = new QueryParser(
        Object.assign({}, request.query, { deleted: false }),
      );

      expect(booksService.get).toHaveBeenCalledWith(bookId, queryParser);
      expect(booksService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: bookMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Update Book', () => {
    beforeEach(() => {
      apiResponse = {
        meta: AppResponse.getSuccessMeta(),
        data: bookMock,
      };
      jest
        .spyOn(booksService, 'update')
        .mockImplementation(() => Promise.resolve(bookMock));

      jest
        .spyOn(booksService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));
    });
    it('should throw error', async () => {
      jest.spyOn(booksService, 'update').mockImplementation(() => {
        throw new Error('Error');
      });
      await booksController.update(bookId, bookMock, response, request, next);
      // expect(booksService.update).toThrow(new Error('Error'));
    });
    it('should call update method with expected payload', async () => {
      await booksController.update(bookId, bookMock, response, request, next);
      expect(booksService.update).toHaveBeenCalledWith(bookId, bookMock);
      expect(booksService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: bookMock,
        queryParser,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });

  describe('Delete Book', () => {
    const deleteMock = {
      id: bookId,
    };
    apiResponse = {
      meta: AppResponse.getSuccessMeta(),
      data: deleteMock,
    };
    beforeEach(() => {
      jest
        .spyOn(booksService, 'delete')
        .mockImplementation(() => Promise.resolve(deleteMock));

      jest
        .spyOn(booksService, 'getResponse')
        .mockImplementation(() => Promise.resolve(apiResponse));

      queryParser = new QueryParser(Object.assign({}, request.query));
    });
    it('delete should throw error', async () => {
      jest.spyOn(booksService, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await booksController.delete(bookId, response, request, next);
      expect(booksService.delete).toThrow(new Error('Error'));
    });
    it('should call delete method with expected payload', async () => {
      await booksController.delete(bookId, response, request, next);
      expect(booksService.delete).toHaveBeenCalledWith(bookId);
      expect(booksService.getResponse).toHaveBeenCalledWith({
        code: HttpStatus.OK,
        value: deleteMock,
      });
      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response._getJSONData()).toEqual(apiResponse);
    });
  });
});

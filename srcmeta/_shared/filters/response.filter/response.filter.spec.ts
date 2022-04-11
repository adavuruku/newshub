import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseFilter } from './response.filter';

export class CustomException {
  constructor(
    readonly code: number,
    readonly message: string,
    readonly messages?: string,
  ) {}

  static NOT_FOUND = (message) => {
    return new CustomException(HttpStatus.NOT_FOUND, message);
  };

  getStatus() {
    return this.code;
  }

  getResponse() {
    const response: any = {
      code: this.code || 500,
      message: this.message,
    };
    if (this.messages) {
      response.messages = this.messages;
    }
    return response;
  }
}

describe('ResponseFilter', () => {
  let responseFilter: ResponseFilter;

  const mockContext: any = {
    switchToHttp: () => ({
      getRequest: () => ({
        url: 'mock-url',
      }),
      getResponse: () => {
        const response = {
          code: jest.fn().mockReturnThis(),
          send: jest.fn().mockReturnThis(),
        };
        return response;
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseFilter],
    }).compile();
    responseFilter = module.get<ResponseFilter>(ResponseFilter);
  });

  it('should be defined', () => {
    expect(responseFilter).toBeDefined();
  });

  it('ResponseFilter - HttpException catch exceptions', () => {
    const mockException: HttpException = new HttpException('mock-error', 500);
    jest.fn(mockContext.switchToHttp().getResponse().send);
    responseFilter.catch(mockException, mockContext);
  });
  it('ResponseFilter - Error catch exceptions', () => {
    const mockException: Error = new Error('mock-error');
    jest.fn(mockContext.switchToHttp().getResponse().send);
    responseFilter.catch(mockException, mockContext);
  });
  it('ResponseFilter - Error catch exceptions', () => {
    const mockException: CustomException = new CustomException(
      101,
      'mock-error',
    );
    jest.fn(mockContext.switchToHttp().getResponse().send);
    responseFilter.catch(mockException, mockContext);
  });
});

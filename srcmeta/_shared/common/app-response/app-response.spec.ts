import { HttpStatus } from '@nestjs/common';
import { AppResponse } from './app-response';

describe('Test app response', () => {
  const appResponse = AppResponse;
  const mockResponse = {
    statusCode: HttpStatus.OK,
    success: true,
  };

  const mockData = {
    title: 'Test app response',
    description: 'Test app response',
  };

  test('App response class should be defined', () => {
    expect(appResponse).toBeDefined();
  });

  test('getSuccessMeta should return success response', () => {
    const response = appResponse.getSuccessMeta();
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('success');
    expect(response).toEqual(mockResponse);
  });
  test('format should with null data', () => {
    const response = appResponse.format(mockResponse);
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('meta');
    expect(response.meta).toBeInstanceOf(Object);
    expect(response.meta).toEqual(mockResponse);
  });
  test('format should with data', () => {
    const response = appResponse.format(mockResponse, mockData);
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty('meta');
    expect(response.meta).toBeInstanceOf(Object);
    expect(response).toHaveProperty('data');
    expect(response.meta).toEqual(mockResponse);
    expect(response.data).toBeInstanceOf(Object);
    expect(response.data).toEqual(mockData);
    expect(response).toEqual({ meta: mockResponse, data: mockData });
  });
});

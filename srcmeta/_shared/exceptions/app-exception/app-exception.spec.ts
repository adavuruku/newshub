import { HttpStatus } from '@nestjs/common';
import { AppException } from './app-exception';

describe('AppException - test', () => {
  let appException: AppException;
  beforeEach(() => {
    appException = new AppException(
      HttpStatus.NOT_FOUND,
      'resources not found',
    );
  });

  it('AppException -  Should be defined', () => {
    expect(appException).toBeDefined();
  });
  it('AppException - NOT_FOUND Should return default value', () => {
    expect(AppException.NOT_FOUND('Resources not found')).toBeInstanceOf(
      Object,
    );
    expect(AppException.NOT_FOUND('Resources not found')).toHaveProperty(
      'code',
    );
    expect(AppException.NOT_FOUND('Resources not found')).toHaveProperty(
      'message',
    );
    expect(
      AppException.NOT_FOUND('Resources not found').messages,
    ).toBeUndefined();
  });
  it('AppException - NOT_FOUND Should return response', () => {
    expect(appException.getStatus()).toEqual(HttpStatus.NOT_FOUND);
  });
  it('AppException getResponse Should return value', () => {
    expect(appException.getResponse()).toBeInstanceOf(Object);
    expect(appException.getResponse()).toHaveProperty('code');
    expect(appException.getResponse()).toHaveProperty('message');
    expect(appException.getResponse().messages).toBeUndefined();
  });
  it('AppException getResponse Should return array of messages', () => {
    appException = new AppException(
      HttpStatus.BAD_REQUEST,
      'invalid request',
      'Field is required',
    );
    expect(appException.getResponse()).toBeInstanceOf(Object);
    expect(appException.getResponse()).toHaveProperty('code');
    expect(appException.getResponse().code).toEqual(HttpStatus.BAD_REQUEST);
    expect(appException.getResponse()).toHaveProperty('message');
    expect(appException.getResponse()).toHaveProperty('message');
  });
  it('AppException getResponse Should return response with code 500', () => {
    appException = new AppException(
      null,
      'invalid request',
      'Field is required',
    );
    expect(appException.getResponse()).toBeInstanceOf(Object);
    expect(appException.getResponse()).toHaveProperty('code');
    expect(appException.getResponse().code).toEqual(500);
    expect(appException.getResponse()).toHaveProperty('message');
    expect(appException.getResponse()).toHaveProperty('message');
  });
});

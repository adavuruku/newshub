import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppException } from '../../exceptions';
import { Response } from 'express';

@Catch()
export class ResponseFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const meta: any = {};
    if (
      exception instanceof AppException ||
      exception instanceof HttpException
    ) {
      meta.statusCode = exception.getStatus();
      meta.error = exception.getResponse();
    } else if (exception instanceof Error) {
      const code = HttpStatus.INTERNAL_SERVER_ERROR;
      meta.statusCode = code;
      meta.error = { code, message: exception.message };
      meta.developer_message = exception;
    } else {
      const code = HttpStatus.INTERNAL_SERVER_ERROR;
      meta.statusCode = code;
      meta.error = {
        code: code,
        message: 'A problem with our server, please try again later',
      };
      meta.developer_message = exception;
    }
    // response.set('status', meta.statusCode);
    response.send({ meta });
  }
}

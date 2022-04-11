/* eslint-disable @typescript-eslint/ban-types */
import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppException } from '../../exceptions';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  static formatErrors(errors: ValidationError[]) {
    // console.log(errors);
    const formatted = {};
    const getNestedErrors = (error) => {
      if (error.children.length === 0) {
        return error.constraints;
      } else {
        return this.formatErrors(error.children);
      }
    };
    errors.forEach((error) => {
      formatted[error.property] = getNestedErrors(error);
    });
    return formatted;
  }

  public static VALIDATION_ERROR(errors) {
    return new AppException(
      HttpStatus.BAD_REQUEST,
      'Bad request / Validation error',
      errors,
    );
  }

  private static toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const formatted = ValidationPipe.formatErrors(errors);
      throw ValidationPipe.VALIDATION_ERROR(formatted);
    }
    return value;
  }
}

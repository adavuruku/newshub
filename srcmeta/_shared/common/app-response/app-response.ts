/**
 * The AppResponse class
 */
import { HttpStatus } from '@nestjs/common';

export class AppResponse {
  /**
   * @param {Object} success the meta object
   * @return {Object} The success response object
   */
  static getSuccessMeta(success = true) {
    return { statusCode: HttpStatus.OK, success };
  }

  /**
   * @param {Object} meta the meta object
   * @param {Object} data success response object
   * @return {Object} The success response object
   */
  static format(meta: any, data = null) {
    const response: any = {};
    response.meta = meta;
    if (data) {
      response.data = data;
    }
    return response;
  }
}

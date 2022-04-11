import { HttpStatus } from '@nestjs/common';

export class AppException {
  constructor(
    readonly code: number,
    readonly message: string,
    readonly messages?: string,
  ) {}

  static NOT_FOUND = (message) => {
    return new AppException(HttpStatus.NOT_FOUND, message);
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

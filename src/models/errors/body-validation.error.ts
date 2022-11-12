import {HttpError} from 'routing-controllers';

export class BodyValidationError extends HttpError {

  private readonly value: string;

  constructor(message: string) {
    super(400, message);

    this.value = 'ValidationError';
    Object.setPrototypeOf(this, BodyValidationError.prototype);
  }
}

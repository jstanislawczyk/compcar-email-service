import {HttpError} from 'routing-controllers';

export class BodyValidationError extends HttpError {

  public readonly value: string = 'ValidationError';

  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, BodyValidationError.prototype);
  }
}

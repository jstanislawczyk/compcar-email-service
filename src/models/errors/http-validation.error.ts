import {HttpError} from 'routing-controllers';
import {ValidationError} from 'class-validator';

export class HttpValidationError extends HttpError {

  public readonly errors: ValidationError[];

  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, HttpValidationError.prototype);
  }
}

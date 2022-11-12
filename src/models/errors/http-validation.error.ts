import {HttpError} from 'routing-controllers';
import {ValidationError} from 'class-validator';

export class HttpValidationError extends HttpError {

  public readonly errors: ValidationError[];
}

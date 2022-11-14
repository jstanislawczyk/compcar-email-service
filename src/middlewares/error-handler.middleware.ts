import {ExpressErrorMiddlewareInterface, HttpError, InternalServerError, Middleware} from 'routing-controllers';
import {Service} from 'typedi';
import {ValidationError} from 'class-validator';
import {BodyValidationError} from '../models/errors/body-validation.error';
import {HttpValidationError} from '../models/errors/http-validation.error';
import {Logger} from '../common/logger';
import {LoggerLevel} from '../models/enums/logger-level';
import {Request, Response} from 'express';

@Service()
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

  public error(error: any, request: Request, response: Response, next: (err: any) => any): void {
    const isValidationError: boolean = error.errors?.[0] instanceof ValidationError;

    if (isValidationError) {
      const message: string = this.buildMessage(error);
      const bodyValidationError: BodyValidationError = new BodyValidationError(message);
      response.status(bodyValidationError.httpCode).json(bodyValidationError);
    } else if (error instanceof HttpError) {
      response.status(error.httpCode).json(error);
    } else {
      Logger.log('Unknown API error. ' + error, LoggerLevel.ERROR);
      response.status(500).json(new InternalServerError(`Unknown error: ${error.message}`));
    }

    next(error);
  }

  private buildMessage(validationError: HttpValidationError): string {
    const messageObject: Record<string, string[]> = {};

    validationError.errors.forEach((error: ValidationError) => {
      if (error.constraints) {
        messageObject[error.property] = Object.values(error.constraints);
      }
    });

    return JSON.stringify(messageObject);
  }
}

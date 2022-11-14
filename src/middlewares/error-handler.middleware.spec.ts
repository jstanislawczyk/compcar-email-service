import {ErrorHandlerMiddleware} from './error-handler.middleware';
import {HttpError, InternalServerError} from 'routing-controllers';
import {Request, Response} from 'express';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import {expect, use} from 'chai';
import sinonChai from 'sinon-chai';
import {HttpValidationError} from '../models/errors/http-validation.error';
import {ValidationError} from 'class-validator';
import {plainToClass} from 'class-transformer';
import {BodyValidationError} from '../models/errors/body-validation.error';

use(sinonChai);

describe('ErrorHandlerMiddleware', () => {

  let response: Response;
  let sandbox: SinonSandbox;
  let statusStub: SinonStub;
  let jsonStub: SinonStub;
  let nextStub: SinonStub;
  let errorHandlerMiddleware: ErrorHandlerMiddleware;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    statusStub = sandbox.stub();
    jsonStub = sandbox.stub();
    nextStub = sandbox.stub();

    statusStub.returns({
      json: jsonStub,
    });

    response = {
      status: statusStub,
    } as unknown as Response;

    errorHandlerMiddleware = new ErrorHandlerMiddleware();
  });

  afterEach(() => sandbox.restore());

  it('should handle http error', () => {
    // Arrange
    const errorMessage: string = 'BadRequest Error';
    const httpError: HttpError = new HttpError(400, errorMessage);

    // Act
    errorHandlerMiddleware.error(httpError, {} as Request, response, nextStub);

    // Assert
    expect(statusStub).to.be.calledOnceWith(httpError.httpCode);
    expect(jsonStub).to.be.calledOnceWith(httpError);
    expect(nextStub).to.be.calledOnceWith(httpError);
    expect(nextStub.firstCall.firstArg).to.be.instanceOf(HttpError);
  });

  describe('should handle validation error', () => {

    const firstValidationError: ValidationError = plainToClass(ValidationError, {
      property: 'firstProperty',
      constraints: {
        isString: 'should be a string',
        minLength: 'min length should be 3 characters',
      },
    });

    it('with single constraint', () => {
      // Arrange
      const httpValidationError: HttpValidationError = plainToClass(HttpValidationError, {
        httpCode: 400,
        errors: [firstValidationError],
      });

      // Act
      errorHandlerMiddleware.error(httpValidationError, {} as Request, response, nextStub);

      // Assert
      const expectedErrorObject: Record<string, string[]> = {
        firstProperty: ['should be a string', 'min length should be 3 characters'],
      };

      expect(statusStub).to.be.calledOnceWith(httpValidationError.httpCode);
      expect(jsonStub.firstCall.firstArg.httpCode).to.be.eql(httpValidationError.httpCode);
      expect(jsonStub.firstCall.firstArg.message).to.be.eql(JSON.stringify(expectedErrorObject));
      expect(jsonStub.firstCall.firstArg).to.be.instanceOf(BodyValidationError);
      expect(nextStub).to.be.calledOnceWith(httpValidationError);
      expect(nextStub.firstCall.firstArg).to.be.instanceOf(HttpValidationError);
    });

    it('with multiple constraints', () => {
      // Arrange
      const secondValidationError: ValidationError = plainToClass(ValidationError, {
        property: 'secondProperty',
        constraints: {
          isString: 'should be a number',
        },
      });
      const httpValidationError: HttpValidationError = plainToClass(HttpValidationError, {
        httpCode: 400,
        errors: [
          firstValidationError,
          secondValidationError,
        ],
      });

      // Act
      errorHandlerMiddleware.error(httpValidationError, {} as Request, response, nextStub);

      // Assert
      const expectedErrorObject: Record<string, string[]> = {
        firstProperty: ['should be a string', 'min length should be 3 characters'],
        secondProperty: ['should be a number'],
      };

      expect(statusStub).to.be.calledOnceWith(httpValidationError.httpCode);
      expect(jsonStub.firstCall.firstArg.httpCode).to.be.eql(httpValidationError.httpCode);
      expect(jsonStub.firstCall.firstArg.message).to.be.eql(JSON.stringify(expectedErrorObject));
      expect(jsonStub.firstCall.firstArg).to.be.instanceOf(BodyValidationError);
      expect(nextStub).to.be.calledOnceWith(httpValidationError);
      expect(nextStub.firstCall.firstArg).to.be.instanceOf(HttpValidationError);
    });
  });

  it('should handle unknown error', () => {
    // Arrange
    const errorMessage: string = 'Some Error';
    const error: Error = new Error(errorMessage);

    // Act
    errorHandlerMiddleware.error(error, {} as Request, response, nextStub);

    // Assert
    expect(statusStub).to.be.calledOnceWith(500);
    expect(jsonStub.firstCall.firstArg.httpCode).to.be.eql(500);
    expect(jsonStub.firstCall.firstArg.message).to.be.eql(`Unknown error: ${errorMessage}`);
    expect(jsonStub.firstCall.firstArg).to.be.instanceOf(InternalServerError);
    expect(nextStub).to.be.calledOnceWith(error);
  });
});

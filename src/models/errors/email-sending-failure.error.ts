import {HttpError} from 'routing-controllers';

export class EmailSendingFailureError extends HttpError {

  public readonly value: string = 'EmailSendingFailureError';

  constructor(message: string) {
    super(500, message);
    Object.setPrototypeOf(this, EmailSendingFailureError.prototype);
  }
}

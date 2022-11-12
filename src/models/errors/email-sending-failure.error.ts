import {HttpError} from 'routing-controllers';

export class EmailSendingFailureError extends HttpError {

  private readonly value: string;

  constructor(message: string) {
    super(500, message);

    this.value = 'EmailSendingFailureError';
    Object.setPrototypeOf(this, EmailSendingFailureError.prototype);
  }
}

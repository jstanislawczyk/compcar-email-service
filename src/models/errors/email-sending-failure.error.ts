export class EmailSendingFailureError extends Error {

  constructor(message: string) {
    super(message);

    Object.defineProperty(this, 'name', {
      value: 'EmailSendingFailureError',
    });
  }
}

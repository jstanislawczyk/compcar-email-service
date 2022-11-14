export class Email {

  constructor(
    public readonly receiverAddress: string,
    public readonly subject: string,
    public readonly html: string,
    public readonly text: string,
  ) {
  }
}

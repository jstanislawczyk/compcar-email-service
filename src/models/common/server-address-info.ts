export class ServerAddressInfo {

  constructor(
    public readonly address: string,
    public readonly port: string,
    public readonly family: string,
  ) {}
}

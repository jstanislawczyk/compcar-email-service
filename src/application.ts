import 'reflect-metadata';
import config from 'config';
import util from 'util';
import {Server} from 'http';
import {createExpressServer} from 'routing-controllers';
import {Logger} from './common/logger';
import {ServerAddressInfo} from './models/common/server-address-info';

export class Application {

  public server: Server;
  public serverAddress: string;

  public async bootstrap(): Promise<void> {
    const app: Server = createExpressServer({
      controllers: [
        `${__dirname}/controllers/*.controller.{js,ts}`,
      ],
    });
    const port: number = config.get('server.port');
    const url: number = config.get('server.url');
    const protocol: number = config.get('server.protocol');

    Logger.log(`Starting server on port=${port}`);

    this.server = await this.startServer(app, url, port);

    Logger.log(`Server started ${protocol}://${this.serverAddress}`);
  }

  public async close(): Promise<void> {
    Logger.log('Closing server');

    await util.promisify(this.server.close);

    Logger.log('Server closed');
  }

  private buildServerAddress(serverAddressInfo: ServerAddressInfo): string {
    return `${serverAddressInfo.address}:${serverAddressInfo.port}`;
  }

  private async startServer(app: Server, url: number, port: number): Promise<Server> {
    return new Promise((resolve) => {
      const server: Server = app.listen(port, url, () => {
        this.serverAddress = this.buildServerAddress(server.address() as unknown as ServerAddressInfo);
        resolve(server);
      });
    });
  }
}

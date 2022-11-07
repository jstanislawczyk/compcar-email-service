import config from 'config';
import {Server} from 'http';
import {createExpressServer} from 'routing-controllers';
import {Logger} from './common/logger';

export class Application {

  public server: Server;

  public async bootstrap(): Promise<void> {
    const app = createExpressServer({
      controllers: [
        `${__dirname}/controllers/*.{js,ts}`,
      ],
    });
    const port: number = config.get('server.port');
    const url: number = config.get('server.url');
    const protocol: number = config.get('server.protocol');

    Logger.log(`Starting server on port=${port}`);

    this.server = app.listen(port);

    Logger.log(`Server started ${protocol}://${url}:${port}`);
  }
}

// Always keep as a first import
import 'reflect-metadata';

import config from 'config';
import util from 'util';
import {Server} from 'http';
import {createExpressServer, useContainer} from 'routing-controllers';
import {Logger} from './common/logger';
import {ServerAddressInfo} from './models/common/server-address-info';
import Container from 'typedi';
import {Consumer, ConsumerOptions} from 'sqs-consumer';
import {LoggerLevel} from './models/enums/logger-level';
import {EmailMessageHandler} from './handlers/email-message.handler';
import {Message, SQSClient} from '@aws-sdk/client-sqs';

export class Application {

  public server: Server;
  public serverAddress: string;
  public isRunning: boolean = false;

  public async bootstrap(): Promise<void> {
    await this.bootstrapHttpServer();
    await this.bootstrapSqsQueue();
    this.isRunning = true;
  }

  public async close(): Promise<void> {
    Logger.log('Closing server');

    await util.promisify(this.server.close);
    this.isRunning = false;

    Logger.log('Server closed');
  }

  private async bootstrapHttpServer(): Promise<void> {
    const app: Server = createExpressServer({
      controllers: [
        `${__dirname}/controllers/*.controller.{js,ts}`,
      ],
      middlewares: [
        `${__dirname}/middlewares/*.middleware.{js,ts}`,
      ],
      defaultErrorHandler: false,
    });
    const port: number = config.get('server.port');
    const url: string = config.get('server.url');
    const protocol: string = config.get('server.protocol');

    Logger.log(`Starting server on ${url}:${port}`);

    useContainer(Container);
    this.server = await this.startServer(app, url, port);

    Logger.log(`Server started ${protocol}://${this.serverAddress}`);
  }

  private buildServerAddress(serverAddressInfo: ServerAddressInfo): string {
    return `${serverAddressInfo.address}:${serverAddressInfo.port}`;
  }

  private async startServer(app: Server, url: string, port: number): Promise<Server> {
    return new Promise((resolve) => {
      const server: Server = app.listen(port, url, () => {
        this.serverAddress = this.buildServerAddress(server.address() as unknown as ServerAddressInfo);
        resolve(server);
      });
    });
  }

  private async bootstrapSqsQueue(): Promise<void> {
    const queueUrl: string = config.get('aws.sqs.emailQueue.url');
    const consumerOptions: ConsumerOptions = this.getSqsConsumerOptions(queueUrl);

    Logger.log(`SQS Consumer starting. URL: ${queueUrl}`);

    const consumer: Consumer = Consumer.create(consumerOptions);

    consumer.on('error', (error: Error) =>
      Logger.log(`SQS Consumer error message: ${error.message}`, LoggerLevel.ERROR)
    );

    consumer.on('processing_error', (error: Error) =>
      Logger.log(`SQS Consumer processing error message: ${error.message}`, LoggerLevel.ERROR)
    );

    consumer.on('stopped', () =>
      Logger.log('SQS Consumer stopped')
    );

    consumer.start();

    Logger.log('SQS Consumer started');
  }

  private getSqsConsumerOptions(queueUrl: string): ConsumerOptions {
    const consumerOptions: ConsumerOptions = {
      queueUrl,
      handleMessage: async (sqsMessage: Message) => {
        Logger.log(`Received email sqs message: ${JSON.stringify(sqsMessage)}`);
        const emailMessageHandler: EmailMessageHandler = Container.get(EmailMessageHandler);
        await emailMessageHandler.handleEmailMessage(sqsMessage);
      },
    };

    const awsEndpoint: string = config.get('aws.endpoint');

    if (awsEndpoint) {
      // Used in tests to make requests to Localstack
      Logger.log(`Using custom AWS endpoint: ${awsEndpoint}`);

      consumerOptions.sqs = new SQSClient({
        endpoint: config.get('aws.endpoint'),
        region: config.get('aws.region'),
      });
    }

    return consumerOptions;
  }
}

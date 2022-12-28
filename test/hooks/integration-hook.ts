import {Application} from '../../src/application';
import config from 'config';
import {
  CreateQueueCommand,
  CreateQueueCommandInput, CreateQueueCommandOutput,
  DeleteQueueCommand,
  DeleteQueueCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';

export let application: Application;
export let sqsClient: SQSClient;
export let queueUrl: string;

before(async () => {
  sqsClient = new SQSClient({
    endpoint: config.get('aws.endpoint'),
    region: config.get('aws.region'),
  });

  await createQueue();

  application = new Application();
  await application.bootstrap();
});

after(async () => {
  await deleteQueue();
  await application.close();
});

const createQueue = async (): Promise<void> => {
  const createQueueInput: CreateQueueCommandInput = {
    QueueName: config.get('aws.sqs.emailQueue.name'),
  };
  const createQueueCommand: CreateQueueCommand = new CreateQueueCommand(createQueueInput);
  const createQueueCommandOutput: CreateQueueCommandOutput = await sqsClient.send(createQueueCommand);

  queueUrl = createQueueCommandOutput.QueueUrl || config.get('aws.sqs.emailQueue.url');

  console.log(`Test queue created: ${queueUrl}`);
};

const deleteQueue = async (): Promise<void> => {
  const deleteQueueInput: DeleteQueueCommandInput = {
    QueueUrl: queueUrl,
  };
  const deleteQueueCommand: DeleteQueueCommand = new DeleteQueueCommand(deleteQueueInput);
  await sqsClient.send(deleteQueueCommand);

  console.log(`Test queue deleted: ${queueUrl}`);
};

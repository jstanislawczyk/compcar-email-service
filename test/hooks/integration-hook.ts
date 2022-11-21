import {Application} from '../../src/application';
import AWS, {SQS} from 'aws-sdk';
import config from 'config';
import {CreateQueueRequest, CreateQueueResult, DeleteQueueRequest} from 'aws-sdk/clients/sqs';

export let application: Application;
export let sqs: SQS;
export let queueUrl: string;

before(async () => {
  AWS.config.update({
    region: config.get('aws.region'),
  });
  sqs = new SQS({
    endpoint: config.get('aws.endpoint'),
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
  const createQueueParams: CreateQueueRequest = {
    QueueName: config.get('aws.sqs.emailQueue.name'),
  };
  const result: CreateQueueResult = await sqs.createQueue(createQueueParams).promise();

  console.log(`Test queue created 1: ${result.QueueUrl}`);
  queueUrl = result.QueueUrl || config.get('aws.sqs.emailQueue.url');

  console.log(`Test queue created 2: ${queueUrl}`);
};

const deleteQueue = async (): Promise<void> => {
  const deleteQueueParams: DeleteQueueRequest = {
    QueueUrl: queueUrl,
  };
  await sqs.deleteQueue(deleteQueueParams).promise();

  console.log(`Test queue deleted: ${queueUrl}`);
};

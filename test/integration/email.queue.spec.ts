import sinon, {SinonSandbox} from 'sinon';
import {EmailDto} from '../../src/models/dto/email.dto';
import {EmailDtoBuilder} from '../utils/builders/email-dto.builder';
import axios from 'axios';
import config from 'config';
import {expect} from 'chai';
import {waitTime} from '../utils/common/time.utils';
import {queueUrl, sqsClient} from '../hooks/integration-hook';
import {
  Message,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput, ReceiveMessageCommandOutput,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';

describe('EmailQueue', () => {

  const emailHost: string = config.get('email.host');
  const emailPort: number = config.get('email.port.http');

  let sandbox: SinonSandbox;

  beforeEach(async () => {
    await clearEmails();

    sandbox = sinon.createSandbox();
  });

  afterEach(() =>
    sandbox.restore()
  );

  after(async () =>
    await clearEmails()
  );

  describe('should send email', () => {
    it('using SQS queue', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();
      const sendMessageInput: SendMessageCommandInput = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(emailDto),
      };
      const sendMessageCommand: SendMessageCommand = new SendMessageCommand(sendMessageInput);

      // Act
      await sqsClient.send(sendMessageCommand);

      // Assert
      const mailhogResponse: Record<string, any> = await waitForEmails();
      const mailhogMessages: Record<string, any> = mailhogResponse.data.items;
      expect(mailhogMessages).to.be.an('array').length(1);

      const registrationMessage: Record<string, any> = mailhogMessages[0];
      expect(registrationMessage.Raw.From).to.be.eql(config.get('email.auth.user'));
      expect(registrationMessage.Raw.To).to.be.eql([emailDto.receiverAddress]);
      expect(registrationMessage.Content.Body).to
        .a('string')
        .and.include(emailDto.html);

      const queueMessages: Message[] | undefined = await getQueueMessages();
      expect(queueMessages).to.be.undefined;
    });
  });

  const getQueueMessages = async (): Promise<Message[] | undefined> => {
    const receiveMessageInput: ReceiveMessageCommandInput = {
      QueueUrl: queueUrl,
    };
    const receiveMessageCommand: ReceiveMessageCommand = new ReceiveMessageCommand(receiveMessageInput);
    const receiveMessageOutput: ReceiveMessageCommandOutput = await sqsClient.send(receiveMessageCommand);

    return receiveMessageOutput.Messages;
  };

  const waitForEmails = async (): Promise<Record<string, any>> => {
    let mailhogResponse: Record<string, any>;

    do {
      console.log('Attempt to fetch emails');
      mailhogResponse = await axios.get(`http://${emailHost}:${emailPort}/api/v2/messages`);
      await waitTime(50);
    } while (mailhogResponse.data.items.length === 0);

    return mailhogResponse;
  };

  const clearEmails = async (): Promise<void> => {
    await axios.delete(`http://${emailHost}:${emailPort}/api/v1/messages`);
  };
});

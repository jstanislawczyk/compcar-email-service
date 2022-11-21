import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import {EmailMessageHandler} from './email-message.handler';
import {EmailService} from '../services/email.service';
import {EmailDtoConverter} from '../dto-converters/email.dto-converter';
import {EmailDto} from '../models/dto/email.dto';
import {EmailDtoBuilder} from '../../test/utils/builders/email-dto.builder';
import {Email} from '../models/common/email';
import {EmailBuilder} from '../../test/utils/builders/email.builder';
import {expect, use} from 'chai';
import {SQSMessage} from 'sqs-consumer';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

use(sinonChai);
use(chaiAsPromised);

describe('EmailMessageHandler', () => {

  let sandbox: SinonSandbox;
  let emailServiceStub: SinonStubbedInstance<EmailService>;
  let emailDtoConverterStub: SinonStubbedInstance<EmailDtoConverter>;
  let emailMessageHandler: EmailMessageHandler;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    emailServiceStub = sandbox.createStubInstance(EmailService);
    emailDtoConverterStub = sandbox.createStubInstance(EmailDtoConverter);

    emailMessageHandler = new EmailMessageHandler(emailServiceStub, emailDtoConverterStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('handleEmailMessage', () => {
    it('should handle email message', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();
      const email: Email = new EmailBuilder().build();
      const sqsMessage: SQSMessage = {
        Body: JSON.stringify(emailDto),
      };

      emailDtoConverterStub.toDtoFromSqsMessage.returns(emailDto);
      emailDtoConverterStub.toModel.returns(email);
      emailServiceStub.sendMail.resolves();

      // Act
      await emailMessageHandler.handleEmailMessage(sqsMessage);

      // Assert
      expect(emailDtoConverterStub.toDtoFromSqsMessage).to.be.calledOnceWith(sqsMessage);
      expect(emailDtoConverterStub.toModel).to.be.calledOnceWith(emailDto);
      expect(emailServiceStub.sendMail).to.be.calledOnceWith(email);
    });

    it('should rethrow error from service', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();
      const email: Email = new EmailBuilder().build();
      const sqsMessage: SQSMessage = {
        Body: JSON.stringify(emailDto),
      };
      const errorMessage: string = 'EmailService error';

      emailDtoConverterStub.toDtoFromSqsMessage.returns(emailDto);
      emailDtoConverterStub.toModel.returns(email);
      emailServiceStub.sendMail.rejects(new Error(errorMessage));

      // Act
      const result = emailMessageHandler.handleEmailMessage(sqsMessage);

      // Assert
      await expect(result).to.be.eventually
        .rejectedWith(errorMessage)
        .and.be.instanceOf(Error);
      expect(emailDtoConverterStub.toDtoFromSqsMessage).to.be.calledOnce;
      expect(emailDtoConverterStub.toModel).to.be.calledOnce;
      expect(emailServiceStub.sendMail).to.be.calledOnce;
    });
  });
});

import {EmailController} from './email.controller';
import {expect, use} from 'chai';
import {EmailDto} from '../models/dto/email.dto';
import {EmailDtoBuilder} from '../../test/utils/builders/email-dto.builder';
import {EmailDtoConverter} from '../dto-converters/email.dto-converter';
import sinon, {SinonSandbox, SinonStubbedInstance} from 'sinon';
import {EmailService} from '../services/email.service';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {Email} from '../models/common/email';
import {EmailBuilder} from '../../test/utils/builders/email.builder';

use(sinonChai);
use(chaiAsPromised);

describe('EmailController', () => {

  let sandbox: SinonSandbox;
  let emailServiceStub: SinonStubbedInstance<EmailService>;
  let emailDtoConverterStub: SinonStubbedInstance<EmailDtoConverter>;
  let emailController: EmailController;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    emailServiceStub = sandbox.createStubInstance(EmailService);
    emailDtoConverterStub = sandbox.createStubInstance(EmailDtoConverter);

    emailController = new EmailController(emailServiceStub, emailDtoConverterStub);
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('createEmail', () => {
    it('should create email', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();
      const email: Email = new EmailBuilder().build();

      emailDtoConverterStub.toModel.returns(email);
      emailServiceStub.sendMail.resolves();

      // Act
      await emailController.createEmail(emailDto);

      // Assert
      expect(emailDtoConverterStub.toModel).to.be.calledOnceWith(emailDto);
      expect(emailServiceStub.sendMail).to.be.calledOnceWith(email);
    });

    it('should rethrow error from service', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();
      const email: Email = new EmailBuilder().build();
      const errorMessage: string = 'EmailService error';

      emailDtoConverterStub.toModel.returns(email);
      emailServiceStub.sendMail.rejects(new Error(errorMessage));

      // Act
      const result = emailController.createEmail(emailDto);

      // Assert
      await expect(result).to.be.eventually
        .rejectedWith(errorMessage)
        .and.be.instanceOf(Error);
      expect(emailDtoConverterStub.toModel).to.be.calledOnce;
      expect(emailServiceStub.sendMail).to.be.calledOnce;
    });
  });
});

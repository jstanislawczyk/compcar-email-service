import {expect, use} from 'chai';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {EmailService} from './email.service';
import nodemailer from 'nodemailer';
import config from 'config';
import {EmailSendingFailureError} from '../models/errors/email-sending-failure.error';
import {Email} from '../models/common/email';
import {EmailBuilder} from '../../test/utils/builders/email.builder';

use(sinonChai);
use(chaiAsPromised);

context('EmailService', () => {

  let sandbox: SinonSandbox;
  let emailService: EmailService;
  let emailTransporterStub: SinonStub;
  let sendMailStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    emailTransporterStub = sandbox.stub(nodemailer, 'createTransport');
    sendMailStub = sandbox.stub();

    sendMailStub.resolves();
    emailTransporterStub.returns({
      sendMail: sendMailStub,
    });

    emailService = new EmailService();
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('sendMail', () => {
    it('should send mail', async () => {
      // Arrange
      const email: Email = new EmailBuilder().build();

      // Act
      await emailService.sendMail(email);

      // Assert
      expect(sendMailStub).to.be.calledOnceWith({
        from: config.get('email.auth.user'),
        to: email.receiverAddress,
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
    });

    it('should throw error', async () => {
      // Arrange
      const email: Email = new EmailBuilder().build();

      // Arrange
      sendMailStub.rejects(new Error('EmailSendingError'));

      // Act
      const result = emailService.sendMail(email);

      // Assert
      await expect(result).to.be.eventually.rejectedWith(
        EmailSendingFailureError,
        `Failed to send an email to ${email.receiverAddress} address`,
      );
      expect(sendMailStub).to.be.calledOnce;
    });
  });
});

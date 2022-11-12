import {application} from '../hooks/application-hook';
import {EmailService} from '../../src/services/email.service';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import nodemailer from 'nodemailer';
import request from 'supertest';
import {EmailDto} from '../../src/models/dto/email.dto';
import {EmailDtoBuilder} from '../utils/builders/email-dto.builder';
import {expect, use} from 'chai';
import config from 'config';
import sinonChai from 'sinon-chai';

use(sinonChai);

describe('/email', () => {

  let sandbox: SinonSandbox;
  let emailTransporterStub: SinonStub;
  let sendMailStub: SinonStub;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    emailTransporterStub = sandbox.stub(nodemailer, 'createTransport');
    sendMailStub = sandbox.stub();

    sendMailStub.resolves();
    emailTransporterStub.returns({
      sendMail: sendMailStub,
    });

    if ((EmailService as any).mailTransporter === undefined) {
      (EmailService as any).mailTransporter = emailTransporterStub;
    }
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('POST', () => {
    it('should return 200 OK if email creating succeeds', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();

      // Act & Assert
      await request(application.serverAddress)
        .post('/email')
        .send(emailDto)
        .expect(200);

      expect(sendMailStub).to.be.calledOnce;
      expect(sendMailStub.firstCall.firstArg.to).to.be.eql(emailDto.receiverAddress);
      expect(sendMailStub.firstCall.firstArg.from).to.be.eql(config.get('email.auth.user'));
      expect(sendMailStub.firstCall.firstArg.html).to.be.eql(emailDto.html);
      expect(sendMailStub.firstCall.firstArg.text).to.be.eql(emailDto.text);
    });

    it('should return 500 Internal Server Error', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();

      sendMailStub.rejects();
      emailTransporterStub.returns({
        sendMail: sendMailStub,
      });
      (EmailService as any).mailTransporter = emailTransporterStub;

      // Act & Assert
      await request(application.serverAddress)
        .post('/email')
        .send(emailDto)
        .expect(500, {
          httpCode: 500,
          message: `Failed to send an email to ${emailDto.receiverAddress} address`,
          value: 'EmailSendingFailureError',
        });
    });
  });
});

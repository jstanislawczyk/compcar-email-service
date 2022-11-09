import sinon, {SinonSandbox} from 'sinon';
import request from 'supertest';
import {application} from '../hooks/application-hook';
import {expect} from 'chai';
import axios from 'axios';
import config from 'config';
import {EmailDto} from '../../src/models/dto/email.dto';
import {EmailDtoBuilder} from '../utils/builders/email-dto.builder';

describe('Email', () => {

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
    it('using API - POST /email', async () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();

      // Act & Assert
      await request(application.serverAddress)
        .post('/email')
        .send(emailDto)
        .expect(200);

      const mailhogResponse: Record<string, any> = await axios.get(`http://${emailHost}:${emailPort}/api/v2/messages`);
      const mailhogMessages: Record<string, any> = mailhogResponse.data.items;
      expect(mailhogMessages).to.be.an('array').length(1);

      const registrationMessage: Record<string, any> = mailhogMessages[0];
      expect(registrationMessage.Raw.From).to.be.eql(config.get('email.auth.user'));
      expect(registrationMessage.Raw.To).to.be.eql([emailDto.receiverAddress]);
      expect(registrationMessage.Content.Body).to
        .a('string')
        .and.include(emailDto.html);
    });
  });

  const clearEmails = async (): Promise<void> => {
    await axios.delete(`http://${emailHost}:${emailPort}/api/v1/messages`);
  };
});

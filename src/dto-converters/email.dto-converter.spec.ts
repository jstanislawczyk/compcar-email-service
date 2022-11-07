import {EmailDtoConverter} from './email.dto-converter';
import {Email} from '../models/common/email';
import {EmailDto} from '../models/dto/email.dto';
import {expect} from 'chai';
import {EmailDtoBuilder} from '../../test/utils/builders/email-dto.builder';

describe('EmailDtoConverter', () => {

  let emailDtoConverter: EmailDtoConverter;

  beforeEach(() =>
    emailDtoConverter = new EmailDtoConverter()
  );

  describe('toModel', () => {
    it('should transform to email model', () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();

      // Act
      const email: Email = emailDtoConverter.toModel(emailDto);

      // Assert
      expect(email).to.eql({
        receiverAddress: emailDto.receiverAddress,
        subject: emailDto.subject,
        html: emailDto.html,
        text: emailDto.text,
      });
    });
  });
});

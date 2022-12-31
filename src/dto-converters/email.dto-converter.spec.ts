import {EmailDtoConverter} from './email.dto-converter';
import {Email} from '../models/common/email';
import {EmailDto} from '../models/dto/email.dto';
import {expect} from 'chai';
import {EmailDtoBuilder} from '../../test/utils/builders/email-dto.builder';
import {Message} from '@aws-sdk/client-sqs';

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

  describe('toDtoFromSqsMessage', () => {
    it('should transform to email model', () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();
      const sqsMessage: Message = {
        Body: JSON.stringify(emailDto),
      };

      // Act
      const returnedEmailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

      // Assert
      expect(returnedEmailDto).to.eql({
        receiverAddress: emailDto.receiverAddress,
        subject: emailDto.subject,
        html: emailDto.html,
        text: emailDto.text,
      });
    });

    describe('should transform to email model with default undefined properties', () => {
      it('for object different than EmailDto', () => {
        // Arrange
        const sqsMessage: Message = {
          Body: JSON.stringify({
            test: 1,
          }),
        };

        // Act
        const emailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

        // Assert
        expect(emailDto).to.eql({
          receiverAddress: undefined,
          subject: undefined,
          html: undefined,
          text: undefined,
        });
      });

      it('for empty object', () => {
        // Arrange
        const sqsMessage: Message = {
          Body: JSON.stringify({}),
        };

        // Act
        const emailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

        // Assert
        expect(emailDto).to.eql({
          receiverAddress: undefined,
          subject: undefined,
          html: undefined,
          text: undefined,
        });
      });
    });

    describe("shouldn't transform to email model if sqs message body", () => {
      it('is undefined', () => {
        // Act
        const emailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage({});

        // Assert
        expect(emailDto).to.be.undefined;
      });

      it('is number', () => {
        // Arrange
        const sqsMessage: Message = {
          Body: '123',
        };

        // Act
        const emailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

        // Assert
        expect(emailDto).to.be.undefined;
      });

      it('is string', () => {
        // Arrange
        const sqsMessage: Message = {
          Body: 'Test',
        };

        // Act
        const emailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

        // Assert
        expect(emailDto).to.be.undefined;
      });

      it('is empty string', () => {
        // Arrange
        const sqsMessage: Message = {
          Body: 'Test',
        };

        // Act
        const emailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

        // Assert
        expect(emailDto).to.be.undefined;
      });

      it('if sqs message body is empty array', () => {
        // Arrange
        const sqsMessage: Message = {
          Body: JSON.stringify([]),
        };

        // Act
        const emailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

        // Assert
        expect(emailDto).to.be.undefined;
      });

      it('if sqs message body is array of emails', () => {
        // Arrange
        const emailDto: EmailDto = new EmailDtoBuilder().build();
        const sqsMessage: Message = {
          Body: JSON.stringify([emailDto]),
        };

        // Act
        const returnedEmailDto: EmailDto | undefined = emailDtoConverter.toDtoFromSqsMessage(sqsMessage);

        // Assert
        expect(returnedEmailDto).to.be.undefined;
      });
    });
  });
});

import {EmailDtoConverter} from './email.dto-converter';
import {Email} from '../models/common/email';
import {EmailDto} from '../models/dto/email.dto';
import {expect} from 'chai';
import {EmailDtoBuilder} from '../../test/utils/builders/email-dto.builder';
import {SQSMessage} from 'sqs-consumer';

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

  describe('toModelFromSqsMessage', () => {
    it('should transform to email model', () => {
      // Arrange
      const emailDto: EmailDto = new EmailDtoBuilder().build();
      const sqsMessage: SQSMessage = {
        Body: JSON.stringify(emailDto),
      };

      // Act
      const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

      // Assert
      expect(email).to.eql({
        receiverAddress: emailDto.receiverAddress,
        subject: emailDto.subject,
        html: emailDto.html,
        text: emailDto.text,
      });
    });

    describe('should transform to email model with default undefined properties', () => {
      it('for object different than EmailDto', () => {
        // Arrange
        const sqsMessage: SQSMessage = {
          Body: JSON.stringify({
            test: 1,
          }),
        };

        // Act
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

        // Assert
        expect(email).to.eql({
          receiverAddress: undefined,
          subject: undefined,
          html: undefined,
          text: undefined,
        });
      });

      it('for empty object', () => {
        // Arrange
        const sqsMessage: SQSMessage = {
          Body: JSON.stringify({}),
        };

        // Act
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

        // Assert
        expect(email).to.eql({
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
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage({});

        // Assert
        expect(email).to.be.undefined;
      });

      it('is number', () => {
        // Arrange
        const sqsMessage: SQSMessage = {
          Body: '123',
        };

        // Act
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

        // Assert
        expect(email).to.be.undefined;
      });

      it('is string', () => {
        // Arrange
        const sqsMessage: SQSMessage = {
          Body: 'Test',
        };

        // Act
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

        // Assert
        expect(email).to.be.undefined;
      });

      it('is empty string', () => {
        // Arrange
        const sqsMessage: SQSMessage = {
          Body: 'Test',
        };

        // Act
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

        // Assert
        expect(email).to.be.undefined;
      });

      it('if sqs message body is empty array', () => {
        // Arrange
        const sqsMessage: SQSMessage = {
          Body: JSON.stringify([]),
        };

        // Act
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

        // Assert
        expect(email).to.be.undefined;
      });

      it('if sqs message body is array of emails', () => {
        // Arrange
        const emailDto: EmailDto = new EmailDtoBuilder().build();
        const sqsMessage: SQSMessage = {
          Body: JSON.stringify([emailDto]),
        };

        // Act
        const email: Email | undefined = emailDtoConverter.toModelFromSqsMessage(sqsMessage);

        // Assert
        expect(email).to.be.undefined;
      });
    });
  });
});

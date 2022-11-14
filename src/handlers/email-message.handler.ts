import {Service} from 'typedi';
import {SQSMessage} from 'sqs-consumer';
import {EmailDtoConverter} from '../dto-converters/email.dto-converter';
import {Email} from '../models/common/email';
import {validateOrReject} from 'class-validator';
import {Logger} from '../common/logger';
import {EmailService} from '../services/email.service';

@Service()
export class EmailMessageHandler {

  constructor(
    private readonly emailService: EmailService,
    private readonly emailDtoConverter: EmailDtoConverter,
  ) {
  }

  public async handleEmailMessage(sqsMessage: SQSMessage): Promise<void> {
    const email: Email | undefined = this.emailDtoConverter.toModelFromSqsMessage(sqsMessage);
    const validatedEmail: Email = await this.validateEmail(email);

    await this.emailService.sendMail(validatedEmail);
  }

  private async validateEmail(email: Email | undefined): Promise<Email> {
    if (email === undefined) {
      throw new Error('Email message validation failed: email cannot be undefined');
    }

    try {
      await validateOrReject(email);
    } catch (error) {
      Logger.log(`Email message validation failed: ${JSON.stringify(error)}`);
      throw error;
    }

    return email;
  }
}

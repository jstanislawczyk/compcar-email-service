import {Service} from 'typedi';
import {EmailDtoConverter} from '../dto-converters/email.dto-converter';
import {Email} from '../models/common/email';
import {validateOrReject} from 'class-validator';
import {Logger} from '../common/logger';
import {EmailService} from '../services/email.service';
import {EmailDto} from '../models/dto/email.dto';
import {Message} from '@aws-sdk/client-sqs';

@Service()
export class EmailMessageHandler {

  constructor(
    private readonly emailService: EmailService,
    private readonly emailDtoConverter: EmailDtoConverter,
  ) {
  }

  public async handleEmailMessage(sqsMessage: Message): Promise<void> {
    const email: Email = await this.getEmail(sqsMessage);

    await this.emailService.sendMail(email);
  }

  private async getEmail(sqsMessage: Message): Promise<Email> {
    const emailDto: EmailDto | undefined = this.emailDtoConverter.toDtoFromSqsMessage(sqsMessage);
    const validatedEmailDto: EmailDto = await this.validateEmailDto(emailDto);

    return this.emailDtoConverter.toModel(validatedEmailDto);
  }

  private async validateEmailDto(emailDto: EmailDto | undefined): Promise<EmailDto> {
    if (emailDto === undefined) {
      throw new Error('Email message validation failed: email cannot be undefined');
    }

    try {
      await validateOrReject(emailDto);
    } catch (error) {
      Logger.log(`Email message validation failed: ${JSON.stringify(error)}`);
      throw error;
    }

    return emailDto;
  }
}

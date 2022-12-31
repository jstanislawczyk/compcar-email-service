import {EmailDto} from '../models/dto/email.dto';
import {Email} from '../models/common/email';
import {Service} from 'typedi';
import {plainToClass} from 'class-transformer';
import {ObjectUtils} from '../common/object.utils';
import {Message} from '@aws-sdk/client-sqs';

@Service()
export class EmailDtoConverter {

  public toModel(emailDto: EmailDto): Email {
    return {
      receiverAddress: emailDto.receiverAddress,
      subject: emailDto.subject,
      html: emailDto.html,
      text: emailDto.text,
    };
  }

  public toDtoFromSqsMessage(sqsMessage: Message): EmailDto | undefined {
    if (sqsMessage.Body === undefined) {
      return undefined;
    }

    let parsedBody: Record<string, any> | undefined;

    try {
      parsedBody = JSON.parse(sqsMessage.Body);
    } catch (error) {
      return undefined;
    }

    if (!ObjectUtils.isObject(parsedBody)) {
      return undefined;
    }

    const emailDto: EmailDto = plainToClass(EmailDto, parsedBody);

    return plainToClass(EmailDto, {
      receiverAddress: emailDto.receiverAddress,
      subject: emailDto.subject,
      html: emailDto.html,
      text: emailDto.text,
    });
  }
}

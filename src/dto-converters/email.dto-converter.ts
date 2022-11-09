import {EmailDto} from '../models/dto/email.dto';
import {Email} from '../models/common/email';
import {Service} from 'typedi';

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
}

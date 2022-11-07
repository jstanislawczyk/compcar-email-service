import {Body, JsonController, Post} from 'routing-controllers';
import {EmailDto} from '../models/dto/email.dto';
import {EmailService} from '../services/email.service';
import {EmailDtoConverter} from '../dto-converters/email.dto-converter';
import {Email} from '../models/common/email';

@JsonController('/email')
export class EmailController {

  constructor(
    private readonly emailService: EmailService,
    private readonly emailDtoConverter: EmailDtoConverter,
  ) {
  }

  @Post()
  public async createEmail(@Body() emailDto: EmailDto): Promise<void> {
    const email: Email = this.emailDtoConverter.toModel(emailDto);
    await this.emailService.sendMail(email);
  }
}

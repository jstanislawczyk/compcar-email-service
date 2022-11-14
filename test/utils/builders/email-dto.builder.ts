import {Builder} from './builder';
import {EmailDto} from '../../../src/models/dto/email.dto';
import {EmailDtoFixtureProvider} from '../fixture-providers/email-dto.fixture-provider';

export class EmailDtoBuilder extends Builder<EmailDto> {

  constructor() {
    const emailDto: EmailDto = EmailDtoFixtureProvider.getEmail();

    super(emailDto);
  }

  public withReceiverAddress(receiverAddress: string): EmailDtoBuilder {
    this.entity.receiverAddress = receiverAddress;
    return this;
  }
}

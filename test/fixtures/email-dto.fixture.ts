import {v4} from 'uuid';
import {EmailDto} from '../../src/models/dto/email.dto';

export const emailDto: EmailDto = {
  html: '<p>test</p>',
  text: 'test',
  subject: 'Test subject',
  receiverAddress: `${v4()}@mail.com`,
};

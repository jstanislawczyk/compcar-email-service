import {EmailDto} from '../../../src/models/dto/email.dto';
import {emailDto} from '../../fixtures/email-dto.fixture';

export class EmailDtoFixtureProvider {

  public static getEmail(): EmailDto {
    return Object.assign({}, emailDto);
  }
}

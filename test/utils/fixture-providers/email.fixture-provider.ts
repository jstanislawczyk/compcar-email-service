import {Email} from '../../../src/models/common/email';
import {email} from '../../fixtures/email.fixture';

export class EmailFixtureProvider {

  public static getEmail(): Email {
    return Object.assign({}, email);
  }
}

import {Builder} from './builder';
import {Email} from '../../../src/models/common/email';
import {EmailFixtureProvider} from '../fixture-providers/email.fixture-provider';

export class EmailBuilder extends Builder<Email> {

  constructor() {
    const email: Email = EmailFixtureProvider.getEmail();

    super(email);
  }
}

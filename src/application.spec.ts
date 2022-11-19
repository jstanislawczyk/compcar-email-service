import {Application} from './application';
import sinon, {SinonSandbox, SinonStub, SinonStubbedInstance} from 'sinon';
import {Consumer} from 'sqs-consumer';
import {expect, use} from 'chai';
import sinonChai from 'sinon-chai';
import config from 'config';
import {Server} from 'http';

use(sinonChai);

describe('Application', () => {

  let sandbox: SinonSandbox;
  let serverStub: SinonStubbedInstance<Server>;
  let startServerStub: SinonStub;
  let sqsConsumerCreateStub: SinonStub;
  let sqsConsumerStub: SinonStubbedInstance<Consumer>;
  let application: Application;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    serverStub = sandbox.createStubInstance(Server);
    startServerStub = sandbox.stub(Application.prototype as any, 'startServer');
    sqsConsumerStub = sandbox.createStubInstance(Consumer);
    sqsConsumerCreateStub = sandbox.stub(Consumer, 'create');

    startServerStub.resolves(serverStub);
    sqsConsumerCreateStub.returns(sqsConsumerStub);

    application = new Application();
  });

  afterEach(() =>
    sandbox.restore()
  );

  describe('bootstrap', () => {
    it('should bootstrap http server', async () => {
      // Act
      await application.bootstrap();

      // Assert
      const expectedServerUrl: string = config.get('server.url');
      const expectedServerPort: string = config.get('server.port');

      expect(application.server).to.be.eql(serverStub);
      expect(startServerStub.firstCall.args[1]).to.be.eql(expectedServerUrl);
      expect(startServerStub.firstCall.args[2]).to.be.eql(expectedServerPort);
    });

    it('should bootstrap sqs consumer', async () => {
      // Act
      await application.bootstrap();

      // Assert
      const expectedSqsUrl: string = config.get('aws.sqs.emailQueue.url');

      expect(sqsConsumerCreateStub).to.be.calledOnce;
      expect(sqsConsumerCreateStub.firstCall.firstArg.queueUrl).to.be.eql(expectedSqsUrl);
      expect(sqsConsumerStub.start).to.be.calledOnce;
    });
  });
});

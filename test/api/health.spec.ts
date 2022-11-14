import {application} from '../hooks/application-hook';
import {HealthStatus} from '../../src/models/enums/health-status';
import request from 'supertest';

describe('/health', () => {

  describe('GET', () => {
    it(`should return application health status=${HealthStatus.OK}`, async () => {
      // Act & Assert
      await request(application.serverAddress)
        .get('/health')
        .expect(200, {
          generalStatus: HealthStatus.OK,
        });
    });
  });
});

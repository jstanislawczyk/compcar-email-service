import {HealthController} from './health.controller';
import {ApplicationHealthDto} from '../models/dto/application-health.dto';
import {expect} from 'chai';
import {HealthStatus} from '../models/enums/health-status';

describe('HealthController', () => {

  let healthController: HealthController;

  beforeEach(() =>
    healthController = new HealthController()
  );

  describe('getApplicationHealth', () => {
    it(`should return application health status=${HealthStatus.OK}`, () => {
      // Act
      const applicationHealthDto: ApplicationHealthDto = healthController.getApplicationHealth();

      // Assert
      expect(applicationHealthDto).to.be.eql({
        generalStatus: HealthStatus.OK,
      });
    });
  });
});

import {HealthStatus} from '../enums/health-status';

export class ApplicationHealthDto {

  public generalStatus: HealthStatus = HealthStatus.OK;
}

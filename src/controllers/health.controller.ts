import {Get, JsonController} from 'routing-controllers';
import {ApplicationHealthDto} from '../models/dto/application-health.dto';

@JsonController('/health')
export class HealthController {

  @Get()
  public getApplicationHealth(): ApplicationHealthDto {
    return new ApplicationHealthDto();
  }
}

import {Get, JsonController} from 'routing-controllers';
import {ApplicationHealthDto} from '../models/dto/application-health.dto';
import {Service} from 'typedi';

@JsonController('/health')
@Service()
export class HealthController {

  @Get()
  public getApplicationHealth(): ApplicationHealthDto {
    return new ApplicationHealthDto();
  }
}

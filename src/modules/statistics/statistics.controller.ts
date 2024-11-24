import { Body, Controller, Post } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { LocationIdDto } from 'src/common/dto/common.dto';
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { Permissions } from 'src/common/constants/constants.permissions';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post('/overall')
  @RequirePermissions(Permissions.STATISTICS_READ)
  overall(@Body() dto: LocationIdDto) {
    return this.statisticsService.getOverAllStats(dto);
  }
}

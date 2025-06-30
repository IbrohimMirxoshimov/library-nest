import { Body, Controller, Post } from '@nestjs/common';
import { RequirePermissions } from '@/common/decorators/permissions.decorators';
import { Permissions } from '@/common/constants/constants.permissions';
import { LocationIdDto } from '@/common/dto/common.dto';
import { StatisticsService } from '@/modules/statistics/statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post('/overall')
  @RequirePermissions(Permissions.STATISTICS_READ)
  overall(@Body() dto: LocationIdDto) {
    return this.statisticsService.getOverAllStats(dto);
  }
}

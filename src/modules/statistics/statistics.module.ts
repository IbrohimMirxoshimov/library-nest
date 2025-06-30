import { Module } from '@nestjs/common';
import { StatisticsController } from '@/modules/statistics/statistics.controller';
import { StatisticsService } from '@/modules/statistics/statistics.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}

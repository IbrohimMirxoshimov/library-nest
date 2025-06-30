import { Module } from '@nestjs/common';
import { LogService } from '@/modules/log/log.service';
import { LogController } from '@/modules/log/log.controller';

@Module({
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}

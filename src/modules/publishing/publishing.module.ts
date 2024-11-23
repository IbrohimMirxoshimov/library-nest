import { Module } from '@nestjs/common';
import { PublishingService } from './publishing.service';
import { PublishingController } from './publishing.controller';

@Module({
  controllers: [PublishingController],
  providers: [PublishingService],
})
export class PublishingModule {}

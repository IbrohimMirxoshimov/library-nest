import { Module } from '@nestjs/common';
import { PublishingService } from '@/modules/publishing/publishing.service';
import { PublishingController } from '@/modules/publishing/publishing.controller';

@Module({
  controllers: [PublishingController],
  providers: [PublishingService],
})
export class PublishingModule {}

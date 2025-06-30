import { Module } from '@nestjs/common';
import { PublicApiController } from '@/modules/public-apis/public-api.controller';
import { PublicApiService } from '@/modules/public-apis/public-api.service';

@Module({
  controllers: [PublicApiController],
  providers: [PublicApiService],
})
export class PublicApiModule {}

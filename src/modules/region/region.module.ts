import { Module } from '@nestjs/common';
import { RegionService } from '@/modules/region/region.service';
import { RegionController } from '@/modules/region/region.controller';

@Module({
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}

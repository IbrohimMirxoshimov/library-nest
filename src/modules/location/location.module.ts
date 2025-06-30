import { Module } from '@nestjs/common';
import { LocationService } from '@/modules/location/location.service';
import { LocationController } from '@/modules/location/location.controller';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}

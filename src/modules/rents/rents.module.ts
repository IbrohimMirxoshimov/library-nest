import { Module } from '@nestjs/common';
import { RentsController } from '@/modules/rents/rents.controller';
import { RentService } from '@/modules/rents/rents.service';

@Module({
  controllers: [RentsController],
  providers: [RentService],
})
export class RentsModule {}

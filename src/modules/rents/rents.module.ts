import { Module } from '@nestjs/common';
import { RentsController } from './rents.controller';
import { RentService } from './rents.service';

@Module({
  controllers: [RentsController],
  providers: [RentService],
})
export class RentsModule {}

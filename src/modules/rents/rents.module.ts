import { Module } from '@nestjs/common';
import { RentsService } from './rents.service';
import { RentsController } from './rents.controller';

@Module({
  controllers: [RentsController],
  providers: [RentsService],
})
export class RentsModule {}

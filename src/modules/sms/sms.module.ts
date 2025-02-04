import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { SmsAppController } from './gateway.controller';

@Module({
  controllers: [SmsController, SmsAppController],
  providers: [SmsService],
})
export class SmsModule {}

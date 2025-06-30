import { Module } from '@nestjs/common';
import { SmsService } from '@/modules/sms/sms.service';
import { SmsController } from '@/modules/sms/sms.controller';

@Module({
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}

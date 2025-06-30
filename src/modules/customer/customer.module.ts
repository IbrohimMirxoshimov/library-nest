import { Module } from '@nestjs/common';
import { CustomerService } from '@/modules/customer/customer.service';
import { CustomerController } from '@/modules/customer/customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}

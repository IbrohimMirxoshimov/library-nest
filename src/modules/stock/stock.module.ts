import { Module } from '@nestjs/common';
import { StockService } from '@/modules/stock/stock.service';
import { StockController } from '@/modules/stock/stock.controller';

@Module({
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}

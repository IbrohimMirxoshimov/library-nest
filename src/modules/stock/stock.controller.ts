import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@/common/constants/constants.permissions';
import { RequirePermissions } from '@/common/decorators/permissions.decorators';
import { FindOneLiDto, FindOneWithLiDto } from '@/common/dto/common.dto';
import { StockService } from '@/modules/stock/stock.service';
import {
  CreateStockDto,
  FindAllStockDto,
  UpdateStockDto,
} from '@/modules/stock/stock.dto';
import { throwErrorIfNotFound } from '@/utils/response.utils';

@ApiBearerAuth()
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @RequirePermissions(Permissions.STOCK_CREATE)
  @Post()
  create(@Body() dto: CreateStockDto) {
    return this.stockService.create(dto);
  }

  @RequirePermissions(Permissions.STOCK_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllStockDto) {
    return this.stockService.findAll(dto);
  }

  @RequirePermissions(Permissions.STOCK_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.stockService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.STOCK_UPDATE)
  update(@Param() find_dto: FindOneWithLiDto, @Body() dto: UpdateStockDto) {
    return this.stockService.update(find_dto, dto);
  }
}

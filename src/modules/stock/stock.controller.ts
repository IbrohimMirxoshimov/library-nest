import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import {
  RequireLocation,
  RequirePermissions,
} from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { CreateStockDto, FindAllStockDto, UpdateStockDto } from './stock.dto';
import { StockService } from './stock.service';

@ApiBearerAuth()
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @RequirePermissions(Permissions.STOCK_CREATE)
  @RequireLocation()
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
  @RequireLocation()
  @RequirePermissions(Permissions.STOCK_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateStockDto) {
    return this.stockService.update(find_dto, dto);
  }
}
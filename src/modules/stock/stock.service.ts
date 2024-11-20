import { Injectable } from '@nestjs/common';
import { stock } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreateStockDto, FindAllStockDto, UpdateStockDto } from './stock.dto';

@Injectable()
export class StockService implements ICrudService<stock> {
  constructor(private prisma: PrismaService) {}

  async create(createStockDto: CreateStockDto) {
    // custom implement
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.stock.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateStockDto) {
    await this.prisma.stock.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async findAll(dto: FindAllStockDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.stock.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.stock.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

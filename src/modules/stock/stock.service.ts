import { Injectable, NotFoundException } from '@nestjs/common';
import { stock, StockStatus } from '@prisma/client';
import { FindOneLiDto, FindOneWithLiDto } from 'src/common/dto/common.dto';
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

  async create(dto: CreateStockDto) {
    return this.prisma.stock.create({
      data: dto,
    });
  }

  async update(find_dto: FindOneWithLiDto, dto: UpdateStockDto) {
    await this.prisma.stock.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async delete(find_dto: FindOneWithLiDto) {
    // Get the stock
    const stock = await this.prisma.stock.findUnique({
      where: { ...find_dto, busy: false },
    });

    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    // Soft delete the stock
    return this.prisma.stock.update({
      where: { id: find_dto.id },
      data: {
        deleted_at: new Date(),
        status: StockStatus.INACTIVE,
      },
    });
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.stock.findFirst({
      where: dto,
    });
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

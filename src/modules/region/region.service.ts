import { Injectable } from '@nestjs/common';
import { region } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import {
  CreateRegionDto,
  FindAllRegionDto,
  UpdateRegionDto,
} from './region.dto';

@Injectable()
export class RegionService implements ICrudService<region> {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRegionDto) {
    return await this.prisma.region.create({
      data: dto,
    });
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.region.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateRegionDto) {
    await this.prisma.region.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.region.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllRegionDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.region.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.region.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

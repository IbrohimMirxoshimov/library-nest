import { Injectable } from '@nestjs/common';
import { location } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import {
  CreateLocationDto,
  FindAllLocationDto,
  UpdateLocationDto,
} from './location.dto';

@Injectable()
export class LocationService implements ICrudService<location> {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLocationDto) {
    return this.prisma.location.create({
      data: dto,
    });
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.location.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateLocationDto) {
    await this.prisma.location.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.location.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllLocationDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.location.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.location.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

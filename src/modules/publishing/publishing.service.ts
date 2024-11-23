import { Injectable } from '@nestjs/common';
import { publishing } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreatePublishingDto, FindAllPublishingDto, UpdatePublishingDto } from './publishing.dto';

@Injectable()
export class PublishingService implements ICrudService<publishing> {
  constructor(private prisma: PrismaService) {}

  async create(createPublishingDto: CreatePublishingDto) {
    // custom implement
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.publishing.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdatePublishingDto) {
    await this.prisma.publishing.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.publishing.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllPublishingDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.publishing.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.publishing.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

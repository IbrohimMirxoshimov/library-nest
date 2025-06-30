import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { FindAllLogDto } from '@/modules/log/log.dto';
import {
  getPaginationOptions,
  getPaginationResponse,
} from '@/utils/pagination.utils';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async create(createLogDto: unknown) {
    // custom implement
    console.log(createLogDto);
  }

  async findAll(dto: FindAllLogDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.log.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.log.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

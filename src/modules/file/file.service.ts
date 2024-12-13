import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { CreateFileDto, FileFindOneDto, FindAllFileDto } from './file.dto';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async findOne(dto: FileFindOneDto) {
    return this.prisma.file.findFirst({
      where: dto,
    });
  }

  async remove(find_dto: FileFindOneDto) {
    const file = await this.prisma.file.delete({
      where: find_dto,
    });
    if (file) {
      const filepath = path.join(process.cwd(), 'uploads', file.name);
      await fs.rm(filepath);
    }
  }

  async findAll(dto: FindAllFileDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.file.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.file.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }

  async create(dto: CreateFileDto) {
    return this.prisma.file.create({
      data: dto,
    });
  }
}

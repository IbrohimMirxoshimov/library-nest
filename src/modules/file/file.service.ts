import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreateFileDto,
  FileFindOneDto,
  FindAllFileDto,
} from '@/modules/file/file.dto';
import {
  getPaginationOptions,
  getPaginationResponse,
} from '@/utils/pagination.utils';

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
      await fsPromises.rm(filepath);
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

  async getFileStream(fileName: string) {
    const filepath = path.join(process.cwd(), 'uploads', fileName);
    return fs.createReadStream(filepath);
  }
}

import { Injectable } from '@nestjs/common';
import { author } from '@prisma/client';
import { FindOneDto } from '../../common/dto/common.dto';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { PrismaService } from '../../prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from '../../utils/pagination.utils';
import { ReqUser } from '../auth/auth.interface';
import {
  CreateAuthorDto,
  GetListAuthorDto,
  UpdateAuthorDto,
} from './authors.dto';

@Injectable()
export class AuthorsService implements ICrudService<author> {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto, currentUser: ReqUser) {
    return await this.prisma.author.create({
      data: {
        name: createAuthorDto.name,
        creator_id: currentUser.id,
      },
    });
  }

  async findOne(dto: FindOneDto) {
    return this.prisma.author.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneDto, dto: UpdateAuthorDto) {
    await this.prisma.author.update({
      where: find_dto,
      data: dto,
    });

    return await this.findOne(find_dto);
  }

  async remove(find_dto: FindOneDto) {
    await this.prisma.author.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: GetListAuthorDto) {
    return await getPaginationResponse({
      items: this.prisma.author.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.author.count({ where: dto.filter }),
      dto,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreateUserDto, FindAllUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService implements ICrudService<user> {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // custom implement
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.user.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateUserDto) {
    await this.prisma.user.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.user.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllUserDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.user.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.user.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

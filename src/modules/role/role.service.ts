import { Injectable } from '@nestjs/common';
import { role } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreateRoleDto, FindAllRoleDto, UpdateRoleDto } from './role.dto';

@Injectable()
export class RoleService implements ICrudService<role> {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // custom implement
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.role.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateRoleDto) {
    await this.prisma.role.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.role.update({
      where: find_dto,
      // TODO_IMPORTANT
      data: {},
    });
  }

  async findAll(dto: FindAllRoleDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.role.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.role.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

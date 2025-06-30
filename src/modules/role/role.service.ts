import { Injectable } from '@nestjs/common';
import { role } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { ICrudService } from '@/common/interfaces/crud.interface';
import { FindOneLiDto } from '@/common/dto/common.dto';
import {
  CreateRoleDto,
  FindAllRoleDto,
  UpdateRoleDto,
} from '@/modules/role/role.dto';
import {
  getPaginationOptions,
  getPaginationResponse,
} from '@/utils/pagination.utils';

@Injectable()
export class RoleService implements ICrudService<role> {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: dto,
    });
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

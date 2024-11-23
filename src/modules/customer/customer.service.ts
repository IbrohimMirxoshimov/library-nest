import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { FindOneWithLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ilike } from 'src/prisma/prisma.utils';
import { omitProperty } from 'src/utils/object.utils';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import {
  CreateCustomerDto,
  FindAllCustomerDto,
  UpdateCustomerDto,
} from './customer.dto';

@Injectable()
export class CustomerService implements ICrudService<user> {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    // Check if the passport is already registered in system
    // may need to add role: null filter to allow users and customers with the same passport
    // TODO: add address relation
    const existingCustomersCount = await this.prisma.user.count({
      where: { passport_id: dto.passport_id, role: null },
    });

    if (existingCustomersCount !== 0) {
      throw new BadRequestException('passport already registered');
    }

    return await this.prisma.user.create({
      data: {
        ...omitProperty(dto, 'location_id'),
        registered_locations: [dto.location_id],
      },
    });
  }

  async findOne(dto: FindOneWithLiDto) {
    return this.prisma.user.findFirst({
      where: {
        ...omitProperty(dto, 'location_id'),
        role_id: null,
        registered_locations: {
          has: dto.location_id,
        },
      },
    });
  }

  async update(find_dto: FindOneWithLiDto, dto: UpdateCustomerDto) {
    await this.prisma.user.update({
      where: {
        ...omitProperty(find_dto, 'location_id'),
        role_id: null,
        registered_locations: {
          has: find_dto.location_id,
        },
      },
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneWithLiDto) {
    await this.prisma.user.update({
      where: {
        ...omitProperty(find_dto, 'location_id'),
        role_id: null,
        registered_locations: {
          has: find_dto.location_id,
        },
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllCustomerDto) {
    const where: Prisma.userWhereInput = {
      first_name: ilike(dto.filter?.first_name),
      last_name: ilike(dto.filter?.last_name),
      phone: ilike(dto.filter?.phone),
      role_id: null,
      registered_locations: {
        has: dto.filter?.location_id,
      },
    };

    const pagination = await getPaginationResponse({
      items: this.prisma.user.findMany({
        where,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.user.count({ where }),
      dto,
    });

    return pagination;
  }
}

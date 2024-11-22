import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
import { Prisma, user } from '@prisma/client';
import { ilike } from 'src/prisma/prisma.utils';

@Injectable()
export class CustomerService implements ICrudService<user> {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Check if the phone number is already registered in system
    // may need to add role: null filter to allow users and customers with the same phone number
    // TODO: add address relation
    const existingCustomersCount = await this.prisma.user.count({
      where: { passport_id: createCustomerDto.passport_id, role: null },
    });
    if (existingCustomersCount !== 0) {
      throw new BadRequestException('Phone number already registered');
    }
    const registered_locations = [];
    if (createCustomerDto.location_id) {
      registered_locations.push(createCustomerDto.location_id);
    }
    delete createCustomerDto.location_id;
    return await this.prisma.user.create({
      data: { ...createCustomerDto, registered_locations },
    });
  }

  async findOne(dto: FindOneLiDto) {
    const location_id = dto.location_id;
    if (!location_id) {
      throw new BadRequestException('Access denied due to invalid location');
    }
    delete dto.location_id;
    return this.prisma.user.findFirst({
      where: {
        ...dto,
        role_id: null,
        registered_locations: {
          has: location_id,
        },
      },
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateCustomerDto) {
    const location_id = find_dto.location_id;
    if (!location_id) {
      throw new BadRequestException('Access denied due to invalid location');
    }
    delete find_dto.location_id;
    delete dto.location_id;
    await this.prisma.user.update({
      where: {
        ...find_dto,
        role_id: null,
        registered_locations: {
          has: location_id,
        },
      },
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    const location_id = find_dto.location_id;
    if (!location_id) {
      throw new BadRequestException('Access denied due to invalid location');
    }
    delete find_dto.location_id;
    await this.prisma.user.update({
      where: {
        ...find_dto,
        role_id: null,
        registered_locations: {
          has: location_id,
        },
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllCustomerDto) {
    const location_id = dto.filter?.location_id;

    if (!location_id) {
      throw new BadRequestException('Access denied due to invalid location');
    }

    const where: Prisma.userWhereInput = {
      first_name: ilike(dto.filter?.first_name),
      last_name: ilike(dto.filter?.last_name),
      phone: ilike(dto.filter?.phone),
      role_id: null,
      registered_locations: {
        has: location_id,
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

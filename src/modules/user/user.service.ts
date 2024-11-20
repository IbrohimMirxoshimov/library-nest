import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { user } from '@prisma/client';
import { FindOneDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreateUserDto, FindAllUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements ICrudService<user> {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if the phone number is already registered in system
    const existingUsersCount = await this.prisma.user.count({
      where: { phone: createUserDto.phone },
    });
    if (existingUsersCount !== 0) {
      throw new BadRequestException('Phone number already registered');
    }

    // Check if the role exists
    const role = await this.prisma.role.findUnique({
      where: { id: createUserDto.role_id },
    });
    if (!role) {
      throw new BadRequestException('Invalid role');
    }

    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        status: 1,
      },
      include: { role: true },
    });
    user.password = null;
    return user;
  }

  async findOne(dto: FindOneDto) {
    const user = await this.prisma.user.findFirst({
      where: dto,
      include: { role: true },
    });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    user.password = null;
    return user;
  }

  async update(find_dto: FindOneDto, dto: UpdateUserDto) {
    await this.prisma.user.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneDto) {
    await this.prisma.user.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAllUserDto) {
    return await getPaginationResponse({
      items: this.prisma.user.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.user.count({ where: dto.filter }),
      dto,
    });
  }
}

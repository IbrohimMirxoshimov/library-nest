import { Injectable } from '@nestjs/common';
import { sms } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreateSmsDto, FindAllSmsDto, UpdateSmsDto } from './sms.dto';

@Injectable()
export class SmsService implements ICrudService<sms> {
  constructor(private prisma: PrismaService) {}

  async create(createSmsDto: CreateSmsDto) {
    // custom implement
    console.log(createSmsDto);
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.sms.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: UpdateSmsDto) {
    await this.prisma.sms.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async findAll(dto: FindAllSmsDto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.sms.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.sms.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}

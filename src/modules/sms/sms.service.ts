import { Injectable, OnModuleInit } from '@nestjs/common';
import { sms } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { CreateSmsDto, FindAllSmsDto, UpdateSmsDto } from './sms.dto';
import * as admin from 'firebase-admin';
import { join } from 'path';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class SmsService implements ICrudService<sms>, OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async create(createSmsDto: CreateSmsDto) {
    // custom implement
    console.log(createSmsDto);
  }

  async onModuleInit() {
    const secrets = require(join(process.env.PWD!, 'secret/sayfa.json'));
    admin.initializeApp({
      credential: admin.credential.cert(secrets),
    });

    const updatedSMSData = {
      smsId: 1,
      smsBatchId: 1,
      message: 'tes124',
      recipients: ['+998950753566'],
    };
    const stringifiedSMSData = JSON.stringify(updatedSMSData);

    const fcmMessage: Message = {
      data: {
        smsData: stringifiedSMSData,
      },
      token:
        'faWPQy1aQBepxYwj6SfK_p:APA91bF0nxY03Mj34LyPvzOXp4Co4KqlRGDTZza0G7got94nZayN0mIw_LyIRy08bbNleqFyp0IBpqaeHLnlzxAvA10JOOEsHhnNGvjIW2wxFqB-WgN2lnM',
      android: {
        priority: 'high',
      },
    };

    const response = await admin.messaging().send(fcmMessage);
    console.log(response);
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

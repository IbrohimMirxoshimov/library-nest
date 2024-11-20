import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import {
  RequireLocation,
  RequirePermissions,
} from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { CreateSmsDto, FindAllSmsDto, UpdateSmsDto } from './sms.dto';
import { SmsService } from './sms.service';

@ApiBearerAuth()
@Controller('smss')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @RequirePermissions(Permissions.SMS_CREATE)
  @RequireLocation()
  @Post()
  create(@Body() dto: CreateSmsDto) {
    return this.smsService.create(dto);
  }

  @RequirePermissions(Permissions.SMS_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllSmsDto) {
    return this.smsService.findAll(dto);
  }

  @RequirePermissions(Permissions.SMS_READ)
  @RequireLocation()
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.smsService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequireLocation()
  @RequirePermissions(Permissions.SMS_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateSmsDto) {
    return this.smsService.update(find_dto, dto);
  }
}

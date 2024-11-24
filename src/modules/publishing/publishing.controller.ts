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
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import {
  CreatePublishingDto,
  FindAllPublishingDto,
  UpdatePublishingDto,
} from './publishing.dto';
import { PublishingService } from './publishing.service';

@ApiBearerAuth()
@Controller('publishings')
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) {}

  @RequirePermissions(Permissions.PUBLISHING_CREATE)
  @Post()
  create(@Body() dto: CreatePublishingDto) {
    return this.publishingService.create(dto);
  }

  @RequirePermissions(Permissions.PUBLISHING_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllPublishingDto) {
    return this.publishingService.findAll(dto);
  }

  @RequirePermissions(Permissions.PUBLISHING_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.publishingService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.PUBLISHING_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdatePublishingDto) {
    return this.publishingService.update(find_dto, dto);
  }

  @Delete(':id')
  remove(@Param() find_dto: FindOneLiDto) {
    return this.publishingService.remove(find_dto);
  }
}

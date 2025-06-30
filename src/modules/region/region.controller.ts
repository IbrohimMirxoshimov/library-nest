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
import { Permissions } from '@/common/constants/constants.permissions';
import { RequirePermissions } from '@/common/decorators/permissions.decorators';
import { FindOneLiDto } from '@/common/dto/common.dto';
import { RegionService } from '@/modules/region/region.service';
import {
  CreateRegionDto,
  FindAllRegionDto,
  UpdateRegionDto,
} from '@/modules/region/region.dto';
import { throwErrorIfNotFound } from '@/utils/response.utils';

@ApiBearerAuth()
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @RequirePermissions(Permissions.REGION_CREATE)
  @Post()
  create(@Body() dto: CreateRegionDto) {
    return this.regionService.create(dto);
  }

  @RequirePermissions(Permissions.REGION_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllRegionDto) {
    return this.regionService.findAll(dto);
  }

  @RequirePermissions(Permissions.REGION_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.regionService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.REGION_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateRegionDto) {
    return this.regionService.update(find_dto, dto);
  }

  @Delete(':id')
  remove(@Param() find_dto: FindOneLiDto) {
    return this.regionService.remove(find_dto);
  }
}

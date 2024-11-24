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
  CreateLocationDto,
  FindAllLocationDto,
  UpdateLocationDto,
} from './location.dto';
import { LocationService } from './location.service';

@ApiBearerAuth()
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @RequirePermissions(Permissions.LOCATION_CREATE)
  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }

  @RequirePermissions(Permissions.LOCATION_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllLocationDto) {
    return this.locationService.findAll(dto);
  }

  @RequirePermissions(Permissions.LOCATION_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.locationService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.LOCATION_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateLocationDto) {
    return this.locationService.update(find_dto, dto);
  }

  @Delete(':id')
  remove(@Param() find_dto: FindOneLiDto) {
    return this.locationService.remove(find_dto);
  }
}

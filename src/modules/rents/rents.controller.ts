import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  RequireLocation,
  RequirePermissions,
} from 'src/common/decorators/permissions.decorators';
import { GetOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { ReqUser } from '../auth/auth.interface';
import { CreateRentDto, GetListRentDto, UpdateRentDto } from './rents.dto';
import { RentsService } from './rents.service';

@ApiBearerAuth()
@Controller('rents')
export class RentsController {
  constructor(private readonly rentsService: RentsService) {}

  @RequirePermissions(Permissions.RENT_CREATE)
  @RequireLocation()
  @Post()
  create(@Body() dto: CreateRentDto, @CurrentUser() user: ReqUser) {
    return this.rentsService.create(dto, user);
  }

  @RequirePermissions(Permissions.RENT_READ)
  @Post('list')
  findAll(@Body() dto: GetListRentDto) {
    return this.rentsService.findAll(dto);
  }

  @RequirePermissions(Permissions.RENT_READ)
  @Post('item')
  findOne(@Body() dto: GetOneLiDto) {
    return this.rentsService.findOne(dto).then(throwErrorIfNotFound);
  }

  @RequirePermissions(Permissions.RENT_UPDATE)
  @Patch()
  update(@Body() dto: UpdateRentDto) {
    return this.rentsService.update(dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rentsService.remove(+id);
  // }
}

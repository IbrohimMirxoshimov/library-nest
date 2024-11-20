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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  RequireLocation,
  RequirePermissions,
} from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { ReqUser } from '../auth/auth.interface';
import { CreateRentDto, FindAllRentDto, UpdateRentDto } from './rents.dto';
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
  @Post('get-list')
  findAll(@Body() dto: FindAllRentDto) {
    return this.rentsService.findAll(dto);
  }

  @RequirePermissions(Permissions.RENT_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.rentsService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.RENT_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateRentDto) {
    console.log(find_dto);

    return this.rentsService.update(find_dto, dto);
  }

  @Delete('/:id')
  remove(@Param() find_dto: FindOneLiDto) {
    return this.rentsService.remove(find_dto);
  }
}

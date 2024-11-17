import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Permissions } from 'src/common/constants/constants.permissions';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  RequireLocation,
  RequirePermissions,
} from 'src/common/decorators/permissions.decorators';
import { ParamIdDto } from 'src/common/dto/param-id.dto';
import { ReqUser } from '../auth/auth.interface';
import { CreateUpdateRentDto, GetListRentDto } from './rents.dto';
import { RentsService } from './rents.service';

@Controller('rents')
export class RentsController {
  constructor(private readonly rentsService: RentsService) {}

  @RequirePermissions(Permissions.RENT_CREATE)
  @RequireLocation()
  @Post()
  create(@Body() dto: CreateUpdateRentDto, @CurrentUser() user: ReqUser) {
    return this.rentsService.create(dto, user);
  }

  @RequirePermissions(Permissions.RENT_READ)
  @Get()
  findAll(dto: GetListRentDto, @CurrentUser() user: ReqUser) {
    return this.rentsService.findAll(dto, user);
  }

  @RequirePermissions(Permissions.RENT_READ)
  @Get(':id')
  async findOne(@Param() dto: ParamIdDto) {
    const item = await this.rentsService.findOne(dto);

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRentDto: CreateUpdateRentDto) {
  //   return this.rentsService.update(+id, updateRentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rentsService.remove(+id);
  // }
}

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
  RequirePermissions
} from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { CreateRoleDto, FindAllRoleDto, UpdateRoleDto } from './role.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @RequirePermissions(Permissions.ROLE_CREATE)
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @RequirePermissions(Permissions.ROLE_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllRoleDto) {
    return this.roleService.findAll(dto);
  }

  @RequirePermissions(Permissions.ROLE_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.roleService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.ROLE_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(find_dto, dto);
  }

  @Delete(':id')
  remove(@Param() find_dto: FindOneLiDto) {
    return this.roleService.remove(find_dto);
  }
}

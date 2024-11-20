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
import { FindOneDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { CreateUserDto, FindAllUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequirePermissions(Permissions.USER_CREATE)
  @Post('/')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @RequirePermissions(Permissions.USER_READ)
  @Post('/get-list')
  findAll(@Body() dto: FindAllUserDto) {
    return this.userService.findAll(dto);
  }

  @RequirePermissions(Permissions.USER_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneDto) {
    return this.userService.findOne(dto).then(throwErrorIfNotFound);
  }

  @RequirePermissions(Permissions.USER_UPDATE)
  @Put('/:id')
  update(@Param() find_dto: FindOneDto, @Body() dto: UpdateUserDto) {
    return this.userService.update(find_dto, dto);
  }

  @RequirePermissions(Permissions.USER_DELETE)
  @Delete('/:id')
  remove(@Param() find_dto: FindOneDto) {
    return this.userService.remove(find_dto);
  }
}

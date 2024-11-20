import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReqUser } from '../auth/auth.interface';
import { RequirePermissions } from '../../common/decorators/permissions.decorators';
import { Permissions } from '../../common/constants/constants.permissions';
import {
  CreateAuthorDto,
  GetListAuthorDto,
  UpdateAuthorDto,
} from './authors.dto';
import { FindOneDto } from '../../common/dto/common.dto';
import { throwErrorIfNotFound } from '../../utils/response.utils';

@ApiBearerAuth()
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @RequirePermissions(Permissions.AUTHOR_CREATE)
  @Post()
  create(@Body() dto: CreateAuthorDto, @CurrentUser() user: ReqUser) {
    return this.authorsService.create(dto, user);
  }

  @RequirePermissions(Permissions.AUTHOR_READ)
  @Post('list')
  findAll(@Body() dto: GetListAuthorDto) {
    return this.authorsService.findAll(dto);
  }

  @RequirePermissions(Permissions.AUTHOR_READ)
  @Post('item')
  findOne(@Body() dto: FindOneDto) {
    return this.authorsService.findOne(dto).then(throwErrorIfNotFound);
  }

  @RequirePermissions(Permissions.AUTHOR_UPDATE)
  @Patch()
  update(@Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(dto);
  }

  @RequirePermissions(Permissions.AUTHOR_DELETE)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.authorsService.remove(+id);
  }
}

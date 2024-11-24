import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto, FindOneWithLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { ReqUser } from '../auth/auth.interface';
import {
  CreateCommentToRentDto,
  CreateRentDto,
  FindAllRentDto,
  UpdateRentDto,
} from './rents.dto';
import { RentService } from './rents.service';

@ApiBearerAuth()
@Controller('rents')
export class RentsController {
  constructor(private readonly rentsService: RentService) {}

  @RequirePermissions(Permissions.RENT_CREATE)
  @Post('/')
  create(@Body() dto: CreateRentDto, @CurrentUser() user: ReqUser) {
    return this.rentsService.create(dto, user);
  }

  @RequirePermissions(Permissions.RENT_READ)
  @Post('/get-list')
  findAll(@Body() dto: FindAllRentDto) {
    return this.rentsService.findAll(dto);
  }

  @RequirePermissions(Permissions.RENT_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.rentsService.findOne(dto).then(throwErrorIfNotFound);
  }

  @RequirePermissions(Permissions.RENT_UPDATE)
  @Put('/:id')
  update(
    @Param() find_dto: FindOneWithLiDto,
    @Body() dto: UpdateRentDto,
    @CurrentUser() user: ReqUser,
  ) {
    return this.rentsService.update(find_dto, dto, user);
  }

  @RequirePermissions(Permissions.RENT_CANCEL)
  @Post('/:id/cancel')
  cancel(@Param() find_dto: FindOneWithLiDto) {
    return this.rentsService.cancel(find_dto);
  }

  @RequirePermissions(Permissions.RENT_REJECT)
  @Post('/:id/reject')
  reject(@Param() find_dto: FindOneWithLiDto) {
    return this.rentsService.reject(find_dto);
  }

  @RequirePermissions(Permissions.RENT_RETURN)
  @Post('/:id/return')
  return(@Param() find_dto: FindOneWithLiDto) {
    return this.rentsService.return(find_dto);
  }

  @RequirePermissions(Permissions.COMMENT_CREATE)
  @Post('/:id/comment')
  createComment(
    @Param() find_dto: FindOneWithLiDto,
    @Body() dto: CreateCommentToRentDto,
    @CurrentUser() user: ReqUser,
  ) {
    return this.rentsService.createComment(find_dto, dto, user);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { FindAllLogDto } from './log.dto';
import { LogService } from './log.service';

@ApiBearerAuth()
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}
  @RequirePermissions(Permissions.LOG_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllLogDto) {
    return this.logService.findAll(dto);
  }
}

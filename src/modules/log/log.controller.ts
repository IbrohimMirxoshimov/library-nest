import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@/common/constants/constants.permissions';
import { RequirePermissions } from '@/common/decorators/permissions.decorators';
import { FindAllLogDto } from '@/modules/log/log.dto';
import { LogService } from '@/modules/log/log.service';

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

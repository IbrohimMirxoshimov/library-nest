import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Permissions } from './common/constants/constants.permissions';
import { CurrentUser } from './common/decorators/current-user.decorator';
import { RequirePermissions } from './common/decorators/permissions.decorators';
import { ReqUser } from './modules/auth/auth.interface';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @RequirePermissions(Permissions.AUTHOR_CREATE)
  getHello(@CurrentUser() user: ReqUser) {
    return this.appService.getHello();
  }
}

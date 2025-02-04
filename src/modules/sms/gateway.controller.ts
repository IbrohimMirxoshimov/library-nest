import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { CreateSmsDto, FindAllSmsDto, UpdateSmsDto } from './sms.dto';
import { SmsService } from './sms.service';
import { Public } from 'src/common/decorators/public.decorator';

// @ApiBearerAuth()
@Controller('/v1/smsapp')
@Public()
export class SmsAppController {
  constructor(private readonly smsService: SmsService) {}

  @Get('/')
  init() {
    return {
      success: true,
    };
  }
  @Post('devices')
  registerDevice(@Body() dto: any) {
    console.log(dto);
// {
//   appVersionCode: 11,
//   appVersionName: '2.3.1',
//   brand: 'samsung',
//   buildId: 'UP1A.231005.007',
//   enabled: true,
//   fcmToken: 'cbXc2gZkTieAwIjwU8rh2H:APA91bFcsSqu4d2-vH6b8tiYE4zwhlxd7s8W--ctyWB1LsjRhUZIWkXYeN39-5vKkbstu3WJMPhcXtVGT6KboqStmu4OEUy5b4IhBtBMgx_MgCqMAmj8aPU',
//   manufacturer: 'samsung',
//   model: 'SM-A525F',
//   os: 'samsung/a52qnsxx/a52q:14/UP1A.231005.007/A525FXXU8FXH1:user/release-keys'
// }
    return {
      success: true,
      data: {
        _id: '1241241gh2vh12',
        
      },
    };
  }

  @Post('/devices/:device_id')
  // { appVersionCode: 11, appVersionName: '2.3.1', enabled: true }
  updateDevice(@Body() dto: any) {
    console.log(dto);
    return {
      success: true,
      data: {
        _id: '1241241gh2vh12',
        ...dto,
      },
    };
  }

  @Post('/devices/:device_id/receive-sms')
  sendReceivedSMS(@Body() dto: any) {
    console.log(dto);
    return {};
  }

  @Post('/devices/:device_id/sms-status')
  sendSMSStatus(@Body() dto: any) {
    console.log(dto);
    return {};
  }
}

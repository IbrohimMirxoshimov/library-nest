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
import { Permissions } from '@/common/constants/constants.permissions';
import { RequirePermissions } from '@/common/decorators/permissions.decorators';
import { FindOneWithLiDto } from '@/common/dto/common.dto';
import { throwErrorIfNotFound } from '@/utils/response.utils';
import {
  CreateCustomerDto,
  FindAllCustomerDto,
  UpdateCustomerDto,
} from '@/modules/customer/customer.dto';
import { CustomerService } from '@/modules/customer/customer.service';

@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @RequirePermissions(Permissions.CUSTOMER_CREATE)
  @Post('/')
  create(@Body() dto: CreateCustomerDto) {
    // handle location_id errors
    return this.customerService.create(dto);
  }

  @RequirePermissions(Permissions.CUSTOMER_READ)
  @Post('/get-list')
  findAll(@Body() dto: FindAllCustomerDto) {
    return this.customerService.findAll(dto);
  }

  @RequirePermissions(Permissions.CUSTOMER_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneWithLiDto) {
    return this.customerService.findOne(dto).then(throwErrorIfNotFound);
  }

  @RequirePermissions(Permissions.CUSTOMER_UPDATE)
  @Put('/:id')
  update(@Param() find_dto: FindOneWithLiDto, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(find_dto, dto);
  }

  @RequirePermissions(Permissions.CUSTOMER_DELETE)
  @Delete('/:id')
  remove(@Param() find_dto: FindOneWithLiDto) {
    return this.customerService.remove(find_dto);
  }
}

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
  RequireLocation,
  RequirePermissions,
} from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { CreateCustomerDto, FindAllCustomerDto, UpdateCustomerDto } from './customer.dto';
import { CustomerService } from './customer.service';

@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @RequirePermissions(Permissions.CUSTOMER_CREATE)
  @RequireLocation()
  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @RequirePermissions(Permissions.CUSTOMER_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAllCustomerDto) {
    return this.customerService.findAll(dto);
  }

  @RequirePermissions(Permissions.CUSTOMER_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.customerService.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequireLocation()
  @RequirePermissions(Permissions.CUSTOMER_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(find_dto, dto);
  }

  @Delete(':id')
  @RequireLocation()
  remove(@Param() find_dto: FindOneLiDto) {
    return this.customerService.remove(find_dto);
  }
}

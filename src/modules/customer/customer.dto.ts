import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';
import { Transform } from 'class-transformer';
import { LocationIdDto } from '../../common/dto/common.dto';

export class CreateCustomerDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.userCreateInput>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  birth_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegram_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  passport_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  passport_pin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  passport_image?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

class CustomerFilterDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.userWhereInput>
{
  @ApiPropertyOptional({
    title: 'First name of the customer',
    description:
      'Search will be performed, records are selected if they contain given input',
    type: String,
  })
  @Transform(({ value }) => {
    // validate initial input type manually
    if (!value || typeof value !== 'string') return {};
    return {
      contains: value,
      mode: 'insensitive',
    };
  })
  // empty object is received after transformation if initial type was invalid
  @IsNotEmptyObject({}, { message: 'first_name must be a string' })
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({
    title: 'Last name of the customer',
    description:
      'Search will be performed, records are selected if they contain given input',
    type: String,
  })
  @Transform(({ value }) => {
    // validate initial input type manually
    if (!value || typeof value !== 'string') return {};
    return {
      contains: value,
      mode: 'insensitive',
    };
  })
  // empty object is received after transformation if initial type was invalid
  @IsNotEmptyObject({}, { message: 'last_name must be a string' })
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({
    title: 'Passport ID of the customer',
    description:
      'Search will be performed, records are selected if they contain given input',
    type: String,
  })
  @Transform(({ value }) => {
    // validate initial input type manually
    if (!value || typeof value !== 'string') return {};
    return {
      contains: value,
      mode: 'insensitive',
    };
  })
  // empty object is received after transformation if initial type was invalid
  @IsNotEmptyObject({}, { message: 'passport_id must be a string' })
  @IsOptional()
  passport_id?: string;

  @ApiPropertyOptional({
    title: 'Passport PIN of the customer',
    description:
      'Search will be performed, records are selected if they contain given input',
    type: String,
  })
  @Transform(({ value }) => {
    // validate initial input type manually
    if (!value || typeof value !== 'string') return {};
    return {
      contains: value,
      mode: 'insensitive',
    };
  })
  // empty object is received after transformation if initial type was invalid
  @IsNotEmptyObject({}, { message: 'passport_pin must be a string' })
  @IsOptional()
  passport_pin?: string;

  @ApiPropertyOptional({
    title: 'Phone number of the customer',
    description:
      'Search will be performed, records are selected if they contain given input',
    type: String,
  })
  @Transform(({ value }) => {
    // validate initial input type manually
    if (!value || typeof value !== 'string') return {};
    return {
      contains: value,
      mode: 'insensitive',
    };
  })
  // empty object is received after transformation if initial type was invalid
  @IsNotEmptyObject({}, { message: 'phone must be a string' })
  @IsOptional()
  phone?: string;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'user'> | undefined;
}

export class FindAllCustomerDto extends FindAllDto {
  @ApplyNestedOptional(CustomerFilterDto)
  filter?: CustomerFilterDto;

  @ApiEnum(Prisma.UserScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.UserScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.UserScalarFieldEnum;
}

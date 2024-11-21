import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';
import { LocationIdDto } from '../../common/dto/common.dto';
import { SearchableField } from '../../common/class-validators/SearchableField';

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extra?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extra_phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  extra_phone_second?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

class CustomerFilterDto
  extends LocationIdDto
  implements ClassImplementation<Prisma.userWhereInput>
{
  @SearchableField()
  first_name?: string;

  @SearchableField()
  last_name?: string;

  @SearchableField()
  passport_id?: string;

  @SearchableField()
  passport_pin?: string;

  @SearchableField()
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

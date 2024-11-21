import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
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
import { SearchableField } from '../../common/class-validators/SearchableField';

export class CreateUserDto
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

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsInt()
  role_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

class UserFilterDto implements ClassImplementation<Prisma.userWhereInput> {
  @SearchableField()
  first_name?: string;

  @SearchableField()
  last_name?: string;

  @SearchableField()
  phone: string;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'user'> | undefined;
}

export class FindAllUserDto extends FindAllDto {
  @ApplyNestedOptional(UserFilterDto)
  filter?: UserFilterDto;

  @ApiEnum(Prisma.UserScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.UserScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.UserScalarFieldEnum;
}

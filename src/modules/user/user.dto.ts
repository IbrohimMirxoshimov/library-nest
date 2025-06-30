import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApplyNestedOptional } from '@/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from '@/common/class-validators/IsPrismaIntFilter';
import { SearchableField } from '@/common/class-validators/SearchableField';
import { FindAllDto } from '@/common/dto/find-all.dto';
import { ApiEnum } from '@/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from '@/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from '@/utils/type.utils';

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

  @ApiProperty()
  @IsString()
  gender: string;
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
  id?: number | Prisma.IntFilter<'user'>;
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

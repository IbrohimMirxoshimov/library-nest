import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator';
import { ApplyNestedOptional } from 'src/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from 'src/common/class-validators/IsPrismaIntFilter';
import { FindAllDto } from 'src/common/dto/find-all.dto';
import { ApiEnum } from 'src/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from 'src/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from 'src/utils/type.utils';


export class CreateRoleDto
  implements ClassImplementation<Prisma.roleCreateInput>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ each: true })
  permissions?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  location_id?: number;
}

export class UpdateRoleDto extends CreateRoleDto {}

class RoleFilterDto implements ClassImplementation<Prisma.roleWhereInput> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPrismaIntFilter()
  @IsOptional()
  @IsPrismaIntFilter()
  id?: number | Prisma.IntFilter<'role'> | undefined;
}

export class FindAllRoleDto extends FindAllDto {
  @ApplyNestedOptional(RoleFilterDto)
  filter?: RoleFilterDto;

  @ApiEnum(Prisma.RoleScalarFieldEnum, {
    type: String,
  })
  @IsEnum(Prisma.RoleScalarFieldEnum)
  @IsOptional()
  order_by?: Prisma.RoleScalarFieldEnum;
}
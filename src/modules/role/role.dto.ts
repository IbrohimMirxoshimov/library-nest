import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ApplyNestedOptional } from '@/common/class-validators/ApplyNested';
import { IsPrismaIntFilter } from '@/common/class-validators/IsPrismaIntFilter';
import { Permissions } from '@/common/constants/constants.permissions';
import { FindAllDto } from '@/common/dto/find-all.dto';
import { ApiEnum } from '@/utils/swagger/ApiEnum';
import { ApiPrismaIntFilter } from '@/utils/swagger/ApiPrismaIntFilter';
import { ClassImplementation } from '@/utils/type.utils';

export class CreateRoleDto
  implements ClassImplementation<Prisma.roleCreateInput>
{
  @ApiProperty()
  @IsString()
  name: string;

  @ApiEnum(Permissions, {
    isArray: true,
    required: true,
  })
  @IsIn(Object.values(Permissions), {
    each: true,
  })
  permissions: number[];

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
